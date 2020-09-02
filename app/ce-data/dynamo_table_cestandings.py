import dynamo
from decimal import Decimal
from boto3.dynamodb.conditions import Key
import datetime, shared_time

## CREATE ##
def create(name, recorded, data):
    item = {"name": name, "recorded": Decimal(str(recorded))}
    x = dynamo.db.Table(dynamo.table_cestanding).put_item(Item=item)
    if x['ResponseMetadata']['HTTPStatusCode'] == 200:
        print("TODO: update update(name, recorded, data)")
        update(name, recorded, data)
    else:
        print("ERROR creating",name, x)

## READ ##
def read(name):
    return dynamo.db.Table(dynamo.table_cestanding).query(
        IndexName='name-index',
        KeyConditionExpression=Key('name').eq(name)
    )
def read_range(name, start, end, fields):
        
    # Prepare Search
    table = dynamo.table_cestanding
    index ='name-recorded-index'
    query = Key('name').eq(name) & Key('recorded').between(Decimal(str(start)), Decimal(str(end)))

    # Evade reserved terms with expression attribute names (i.e. name becomes #name)
    expression_attribute_names = {}
    projection_expression = ""
    for field in fields.split(','):
        expression = "#"+str(field) # prefix each field expression with #
        expression_attribute_names[expression] = field
        projection_expression += expression + ","
    projection_expression = projection_expression[:-1]

    # Execute Search
    print("Getting fields >",fields,"< from",index,"between",shared_time.datetime_from_epoch_seconds(start),"/",start,"and",shared_time.datetime_from_epoch_seconds(end),"/",end)
    
    return dynamo.query(
        table_name=table,
        index_name=index,
        key_condition_expression=query,
        projection_expression=projection_expression,
        expression_attribute_names=expression_attribute_names
    )
    
    # return dynamo.query(table, index_recorded, query, fields)

## UPDATE##
def update(name, recorded, data):
    now = datetime.datetime.utcnow()
    record = read(name)
    if record['Count'] == 0:
        create(name, recorded, data)
    else:
        # Add non-null attributes to update_expression
        expression = "set "
        names = {}
        values = {}

        # For each key in the given data, add this to the update expression
        for key in data:
            value = data[key]
            print("Updating "+str(name)+" '"+str(key)+"' to '"+str(value)+"'")
            expression += dynamo.update_expression(key, data, names, values)

        # Update UpdatedAt 
        # NOTE: It's important to leave this as the last expression to close out the 'set' expression
        expression += "updatedAt=:updatedAt"
        values[":updatedAt"] = now.strftime('%Y-%m-%dT%H:%M:%S.000Z')

        # Execute update query
        dynamo.db.Table(dynamo.table_cestanding).update_item(
            Key={'name':name, 'recorded': Decimal(str(recorded))},
            UpdateExpression=expression,
            ExpressionAttributeValues=values,
            ExpressionAttributeNames=names,
            ReturnValues="UPDATED_NEW"
        )


## TESTS ##
def test_create():
    name = 'zzzTestUser'
    recorded = 1599018733
    data = {"rank":"Class Leader", "class":"Priest", "ep":123, "gp":456, "priority": 34}
    create(name, recorded, data)
def test_read():
    name = 'zzzTestUser'
    x = read(name)
    print(x)
def test_read_range():
    name = 'zzzTestUser'
    start = 1599018723
    end = 1599018767
    fields = 'name,recorded'
    x = read_range(name, start, end, fields)
    print(x)
def test_update():
    name = 'zzzTestUser'
    recorded = 1599018733
    data = {"ep": 444, "gp": 777, "priority": 123}
    update(name, recorded, data)


## LOCAL TESTING ##
if __name__ == "__main__":
    print("Testing Locally")
    # test_create()
    # test_read()
    # test_read_range()
    test_update()

