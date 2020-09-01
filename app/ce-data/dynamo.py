import boto3
from decimal import Decimal
import secrets

# RESOURCES
region = secrets.aws_region
endpoint = 'https://dynamodb.'+region+'.amazonaws.com'
aws_access_key_id=secrets.aws_access_key_id
aws_secret_access_key=secrets.aws_secret_access_key
db = boto3.resource('dynamodb', region_name=region, endpoint_url=endpoint, aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)

# TABLES
table_ceplayer = 'CEPlayer-2ui6dujmwjc6lpdhgxkyvqxdru-prod'
table_cestandings = 'CEStandings-2ui6dujmwjc6lpdhgxkyvqxdru-prod'

def query(table_name, index_name, key_condition_expression, projection_expression):

    # Examples:
    #   index_name = 'slug-captured-index'
    #   key_condition_expression = Key(key_name).eq(slug) & Key('captured').between(start, end)
    #   projection_expression = 'plate,confidence,captured' # use this to chose what columns you want data for

    # Get first chunk of data
    all_data = db.Table(table_name).query(
        IndexName=index_name,
        KeyConditionExpression=key_condition_expression,
        ProjectionExpression=projection_expression,
    )

    # Get more data if required
    last_key = all_data.get('LastEvaluatedKey')
    while last_key != None:
        more_data = db.Table(table_name).query(
            IndexName=index_name,
            KeyConditionExpression=key_condition_expression,
            ProjectionExpression=projection_expression,
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

def attribute_update_expression(key, data, attribute_names, attribute_values):
    # This function is used to update the expressions for 
    key = str(key)
    x = data.get(key)
    if x != None:
        attribute_names["#"+key] = key
        if type(x) == float or type(x) == int:
            print("Setting attribute_update_expression Decimal", x)
            attribute_values[":"+key] = Decimal(x)
        else:
            print("Setting attribute_update_expression String", x)
            attribute_values[":"+key] = str(x)
        
        return "#"+key+"=:"+key+"," # update_expression
    return "" # don't append anything, since the values we were given were null
