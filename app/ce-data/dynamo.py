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
    if x != None:
        attribute_names["#"+key] = key
        if type(x) == float or type(x) == int:
            # print("Setting attribute_update_expression Decimal", x)
            attribute_values[":"+key] = Decimal(str(x)) # https://github.com/boto/boto3/issues/665#issuecomment-340260257
        else:
            # print("Setting attribute_update_expression String", x)
            attribute_values[":"+key] = str(x)
        
        return "#"+key+"=:"+key+"," # update_expression
    return "" # don't append anything, since the values we were given were null

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
    item = { key:value }
    if timestamp_key != None:
        item = { key:value, timestamp_key:data.get(timestamp_key) }
    print("ITEM TO BE INSERTERD",item)
    x = db.Table(table).put_item(Item=item)
    if x['ResponseMetadata']['HTTPStatusCode'] == 200:
        print("CREATED", key, value, "in table", table, "with index", index)
        return generic_update(table, index, key, value, data, timestamp_key)
    else:
        print("GENERIC CREATE ERROR", table, index, key, value, data)
        return None

## GENERIC READ ##
def generic_read(table, index, key, value, timestamp_key=None, timestamp_value=None):
    # table = dynamo.table_employees
    # index = 'name-index'
    # key = 'name'
    # value = 'bob'
    key_condition = Key(key).eq(value)
    if timestamp_key != None:
        key_condition = Key(key).eq(value) & Key(timestamp_key).eq(timestamp_value)
    return db.Table(table).query(
        IndexName=index,
        KeyConditionExpression=key_condition
    )
def generic_read_range(table, index, key, value, timestamp_key=None, start=None, end=None):
    # table = dynamo.table_employees
    # index = 'name-index'
    # key = 'name'
    # value = 'bob'
    key_condition = Key(key).eq(value)
    if timestamp_key != None:
        key_condition = Key(key).eq(value) & Key(timestamp_key).between(start, end)
        print("generic_read_range",table, index, key, value, timestamp_key, start, end)
    return db.Table(table).query(
        IndexName=index,
        KeyConditionExpression=key_condition
    )

## TODO: TIM .. UPDATE THE INDEX DEPENDING ON WHETHER OR NOT YOU HAVE A timestamp

## GENERIC UPDATE ##
def generic_update(table, index, key, value, data, timestamp_key=None):
    print("generic_update")
    # table = dynamo.table_employees
    # index = 'name-index'
    # key = 'name'
    # value = 'bob'
    # data = {"job":"manager","age":69}
    
    # handle cases where we have a timestam
    timestamp_value = None
    if timestamp_key != None:
        timestamp_value = data.get(timestamp_key)

    ## Create new record if it doesn't exist
    now = datetime.datetime.utcnow()
    record = generic_read(table, index, key, value, timestamp_key, timestamp_value)
    if record['Count'] == 0:
        return generic_create(table, index, key, value, data, timestamp_key)
    
    ## Update existing record
    else:
        # Add non-null attributes to update_expression
        expression = "set "
        names = {}
        values = {}

        # For each item in the given data, add this to the update expression
        for field in data:
            x = data[field]
            print("Updating "+str(key)+" '"+str(field)+"' to '"+str(x)+"'")
            if field != timestamp_key: # avoid error "attribute is part of the key"
                expression += update_expression(field, data, names, values)

        # Update UpdatedAt 
        # NOTE: It's important to leave this as the last expression to close out the 'set' expression
        expression += "updatedAt=:updatedAt"
        values[":updatedAt"] = now.strftime('%Y-%m-%dT%H:%M:%S.000Z')

        # Execute update query
        query_key = {key:value}
        if timestamp_key != None:
            query_key = {key:value,timestamp_key:data.get(timestamp_key)}
        print("UPDATE QUERY KEY", query_key)
        return db.Table(table).update_item(
            Key=query_key,
            UpdateExpression=expression,
            ExpressionAttributeValues=values,
            ExpressionAttributeNames=names,
            ReturnValues="UPDATED_NEW"
        )

## GENERIC DELETE ##
def generic_delete(table, key, value, timestamp_key=None, timestamp_value=None):
    query_key = {key:value}
    if timestamp_key != None:
        query_key = {key:value,timestamp_key:Decimal(str(timestamp_value))}
    return db.Table(table).delete_item(Key=query_key)