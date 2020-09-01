import dynamo
from decimal import Decimal
from boto3.dynamodb.conditions import Key

## CREATE ##
def create(player_name, player_rank, player_class):
    item = {
        "name"  : player_name,
        "rank"  : player_rank,
        "class" : player_class,
    }
    return dynamo.db.Table(dynamo.table_ceplayer).put_item(Item=item)

## READ ##
def read(player_name):
    return dynamo.db.Table(dynamo.table_ceplayer).query(
        IndexName='name-index',
        KeyConditionExpression=Key('name').eq(player_name)
    )

## TESTS ##
def test_read(player_name):
    x = read(player_name)
    print(x)

def test_create():
    player_name = 'Testplayer'
    player_rank = 'Alt'
    player_class = 'Warlock'
    create(player_name, player_rank, player_class)
    read(player_name)

## LOCAL TESTING ##
if __name__ == "__main__":
    print("Testing Locally")
    test_create()