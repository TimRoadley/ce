import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal
import secrets
import datetime

# RESOURCES
region = secrets.aws_region
endpoint = 'https://dynamodb.'+region+'.amazonaws.com'
aws_access_key_id=secrets.aws_access_key_id
aws_secret_access_key=secrets.aws_secret_access_key
db = boto3.resource('dynamodb', region_name=region, endpoint_url=endpoint, aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)

# TABLES
table_ceplayer = 'CEPlayer-2ui6dujmwjc6lpdhgxkyvqxdru-prod'
table_cestanding = 'CEStanding-2ui6dujmwjc6lpdhgxkyvqxdru-prod'
table_cebench = 'CEBench-2ui6dujmwjc6lpdhgxkyvqxdru-prod'

def query(table_name, index_name, key_condition_expression, projection_expression, expression_attribute_names):

    # Examples:
    #   index_name = 'slug-captured-index'
    #   key_condition_expression = Key(key_name).eq(slug) & Key('captured').between(start, end)
    #   projection_expression = 'plate,confidence,captured' # use this to chose what columns you want data for

    # Get first chunk of data
    all_data = db.Table(table_name).query(
        IndexName=index_name,
        KeyConditionExpression=key_condition_expression,
        ProjectionExpression=projection_expression,
        ExpressionAttributeNames=expression_attribute_names
    )

    # Get more data if required
    last_key = all_data.get('LastEvaluatedKey')
    while last_key != None:
        more_data = db.Table(table_name).query(
            IndexName=index_name,
            KeyConditionExpression=key_condition_expression,
            ProjectionExpression=projection_expression,
            ExpressionAttributeNames=expression_attribute_names,
            ExclusiveStartKey=last_key
        )
        all_data['Count'] += more_data['Count']
        all_data['Items'].extend(more_data['Items'])
        last_key = more_data.get('LastEvaluatedKey')
    return all_data

def add(source, target, key):
    # this adds only non-null items to the target
    item = source.get(key)
    # print("Adding " + str(key) + " " + str(item))
    if item != None:
        target[key] = item

def update_expression(key, data, attribute_names, attribute_values):
    # This function is used to update the expressions for 
    key = str(key)
    x = data.get(key)
    attribute_names["#"+key] = key
    if x == None:
        attribute_values[":"+key] = None
    elif type(x) == float or type(x) == int:
        attribute_values[":"+key] = Decimal(str(x)) # https://github.com/boto/boto3/issues/665#issuecomment-340260257
    elif type(x) == list or type(x) == dict:
        attribute_values[":"+key] = x
    else:
        attribute_values[":"+key] = str(x)        
    return "#"+key+"=:"+key+"," # update_expression

####
## GENERIC COMMANDS
####

## GENERIC CREATE ##
def generic_create(table, index, key, value, data, timestamp_key=None):
    # table = dynamo.table_employees
    # index = 'name-index'
    # key = 'name'
    # value = 'bob'
    # data = {"job":"cleaner","age":55}
    now = datetime.datetime.utcnow()
    createdAt = now.strftime('%Y-%m-%dT%H:%M:%S.000Z')
    item = { key:value, "createdAt": createdAt}
    print("Creating Item", item)
    if timestamp_key != None:
        item[timestamp_key] = Decimal(str(data.get(timestamp_key)))
    print("ITEM TO BE INSERTED",item)
    x = db.Table(table).put_item(Item=item)
    if x['ResponseMetadata']['HTTPStatusCode'] == 200:
        print("CREATED", key, value, "in table", table, "with index", index)
        return generic_update(table, index, key, value, data, timestamp_key)
    else:
        print("GENERIC CREATE ERROR", table, index, key, value, data)
        return None

## GENERIC READ ##
def generic_read(table, index, key, value, fields=None, timestamp_key=None, timestamp_value=None, timestamp_start=None, timestamp_end=None):
    # table = dynamo.table_employees
    # index = 'name-index'
    # key = 'name'
    # value = 'bob'
    # OPTIONAL: fields = 'name,age,height'
    # OPTIONAL: timestamp_key = 'recorded'
    # OPTIONAL: timestamp_start = 1599020000
    # OPTIONAL: timestamp_end   = 1599030000
    
    # Default query
    query = Key(key).eq(value)
    
    # Prepare timestamp based query (if timestamp_key is supplied)
    if timestamp_key != None:
        query = Key(key).eq(value) & Key(timestamp_key).eq(Decimal(str(timestamp_value)))  
        
        # Prepare timestamp range based query (if start and end is supplied)
        if timestamp_start != None and timestamp_end != None:
            query = Key(key).eq(value) & Key(timestamp_key).between(Decimal(str(timestamp_start)), Decimal(str(timestamp_end)))
    
    # Execute query
    if fields == None:    
        return db.Table(table).query(
            IndexName=index,
            KeyConditionExpression=query
        )
    else:
        return db.Table(table).query(
            IndexName=index,
            KeyConditionExpression=query,
            ProjectionExpression=fields # Example: name,age,height
        )
    
## GENERIC UPDATE ##
def generic_update(table, index, key, value, data, timestamp_key=None, timestamp_value=None):
    # table = dynamo.table_employees
    # index = 'name-index'
    # key = 'name'
    # value = 'bob'
    # data = {"job":"manager","age":69}
    
    # Handle cases where we have a timestamp_key yet no timestamp_value
    if timestamp_key != None:
        if timestamp_value == None:
            timestamp_value = data.get(timestamp_key)

    # Create new record if it doesn't exist
    now = datetime.datetime.utcnow()
    record = generic_read(table, index, key, value, timestamp_key=timestamp_key, timestamp_value=timestamp_value)
    if record['Count'] == 0:
        return generic_create(table, index, key, value, data, timestamp_key)
    
    # Update existing record
    else:
        # Add non-null attributes to update_expression
        expression = "set "
        names = {}
        values = {}

        # For each item in the given data, add this to the update expression
        for field in data:
            x = data[field]
            print("Preparing to update "+str(value)+" '"+str(field)+"' to '"+str(x)+"'")
            if field != timestamp_key: # avoid error "attribute is part of the key"
                expression += update_expression(field, data, names, values)

        # Update UpdatedAt 
        # NOTE: It's important to leave updatedAt as the last expression to close out the 'set' expression
        expression += "updatedAt=:updatedAt"
        values[":updatedAt"] = now.strftime('%Y-%m-%dT%H:%M:%S.000Z')

        # Prepare update
        query_key = {key:value}
        if timestamp_key != None:
            query_key = {key:value,timestamp_key:Decimal(str(timestamp_value))}

        if timestamp_key != None:
            print("UPDATING",key,value,timestamp_key,timestamp_value,values)
        else:
            print("UPDATING",key,value,values)

        # Execute update
        return db.Table(table).update_item(
            Key=query_key,
            UpdateExpression=expression,
            ExpressionAttributeValues=values,
            ExpressionAttributeNames=names,
            ReturnValues="UPDATED_NEW"
        )

## GENERIC DELETE ##
def generic_delete(table, key, value, timestamp_key=None, timestamp_value=None, timestamp_start=None, timestamp_end=None):
    
    # Default query
    query_key = {key:value}

    # Prepare timestamp based query (if timestamp_key is supplied)
    if timestamp_key != None:
        query_key = {key:value,timestamp_key:Decimal(str(timestamp_value))}
        
        # Prepare timestamp range based query (if timestamp_start and timestamp_end is supplied)
        if timestamp_start != None and timestamp_end != None:
            query_key = Key(key).eq(value) & Key(timestamp_key).between(Decimal(str(timestamp_start)), Decimal(str(timestamp_end)))
    
    # Execute delete
    x = db.Table(table).delete_item(Key=query_key)
    if x['ResponseMetadata']['HTTPStatusCode'] == 200:
        print("DELETED", key, value, "in table", table)
    else:
        print("GENERIC DELETE ERROR", table, key, value)
