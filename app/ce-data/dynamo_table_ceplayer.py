import dynamo
from decimal import Decimal
from boto3.dynamodb.conditions import Key
import datetime

## CREATE ##
def create(name, data):
    item = {"name": name}
    x = dynamo.db.Table(dynamo.table_ceplayer).put_item(Item=item)
    result = x['ResponseMetadata']['HTTPStatusCode']
    if result == 200:
        update(name, data)
    else:
        print("ERROR creating",name, x)

## READ ##
def read(name):
    return dynamo.db.Table(dynamo.table_ceplayer).query(
        IndexName='name-index',
        KeyConditionExpression=Key('name').eq(name)
    )

## UPDATE ##
def update(name, data):
    now = datetime.datetime.utcnow()
    record = read(name)
    if record['Count'] == 0:
        create(name, data)
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

        if names == {}:  # Avoid error 'ExpressionAttributeNames must not be empty'
            dynamo.db.Table(dynamo.table_ceplayer).update_item(
                Key={'name': name},
                UpdateExpression=expression,
                ExpressionAttributeValues=values,
                ReturnValues="UPDATED_NEW"
            )
        else:
            dynamo.db.Table(dynamo.table_ceplayer).update_item(
                Key={'name': name},
                UpdateExpression=expression,
                ExpressionAttributeValues=values,
                ExpressionAttributeNames=names,
                ReturnValues="UPDATED_NEW"
            )


## TESTS ##

def test_create():
    name = 'Testplayer2'
    data = {"rank":"Class Leader", "class":"Priest"}
    create(name, data)

def test_update():
    name = 'Testplayer1'
    data = {"rank":"Raider", "class":"Warlock"}
    create(name, data)

## LOCAL TESTING ##
if __name__ == "__main__":
    print("Testing Locally")
    test_create()
    test_update()
