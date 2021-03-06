import boto3, os, sys, uuid, json, datetime
from urllib.parse import unquote_plus
import dynamo

def load_json(filename):
    with open(filename) as f:
        return json.load(f)

def utc_from_filekey(filekey):
    # INPUT 2020/2020-07-29_standings.json
    x = filekey.replace('_standings.json','')
    x = x.split('/')
    x = x[1]
    x = datetime.datetime.strptime(x, "%Y-%m-%d")
    x = x.timestamp()
    return x

def update_players(event, context):

    print('## EVENT')
    print(event)

    records = 0
    data = {}
    for record in event['Records']:
        records += 1
        bucket = record['s3']['bucket']['name'] # ce-standings
        key = unquote_plus(record['s3']['object']['key']) # 2020/2020-07-29_standings.json
        date_utc = utc_from_filekey(key)
        tmpkey = key.replace('/', '')
        download_path = '/tmp/{}{}'.format(uuid.uuid4(), tmpkey)
        s3_client = boto3.client('s3')
        s3_client.download_file(bucket, key, download_path)
        result = load_json(download_path)

        print('## RESULT')
        print(result)

        roster = result.get('roster')
        if roster != None:
            print('## ROSTER')
            
            for player in roster:
                # ["Absolute","Hunter","Alt",0,100,0]
                player_name = player[0]
                player_class = player[1]
                player_rank = player[2]
                player_ep = player[3]
                player_gp = player[4]
                player_priority = player[5]
                
                if player_rank == "Alt":
                    print('Skipped ALT',player_rank,player_class,player_name)
                
                elif player_name == "Agielz" or player_name == "Leiga" or player_name == "Agiels":
                    print('Skipped AGIELx ALTS',player_rank,player_class,player_name)                    
                
                elif player_name == "Kf":
                    print('Skipped GKICKED',player_rank,player_class,player_name)
                
                elif player_gp == 100 and player_ep == 0 and player_priority == 0:
                    print('Skipped INACTIVE',player_rank,player_class,player_name)

                else:
                    print('>>> UPDATING',player_rank,player_class,player_name,"GP",player_gp,"EP",player_ep,"PRIORITY",player_priority)
                    
                    # Update ceplayer
                    data = {
                        "class":player_class,
                        "rank":player_rank,
                        "latest_ep":player_ep,
                        "latest_gp":player_gp,
                        "latest_priority":player_priority,
                        "latest_update":date_utc # TODO: run a post process to align with the latest data in cestanding
                    }
                    dynamo.generic_update(dynamo.table_ceplayer, 'name-index', 'name', player_name, data)
                    
                    # Update cestanding
                    data = {
                        "ep":player_ep,
                        "gp":player_gp,
                        "priority":player_priority,
                        "recorded":date_utc # TODO: run a post process to align with the latest data in cestanding
                    }
                    dynamo.generic_update(dynamo.table_cestanding, 'name-recorded-index', 'name', player_name, data, timestamp_key='recorded')

    print('## END')

    body = {
        "original_event": event,
        "records":records,
        "data": data
    }

    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }

    return response

## TESTS ##
def test_utc_from_filekey():
    filekey = '2020/2020-07-29_standings.json'
    x = utc_from_filekey(filekey)
    print(x)

def test_update_players():
    event = {
        "Records": [
        {
            "s3": {
                "bucket": {
                    "name": "ce-standings"
                },
                "object": {
                    "key": "2020/2020-07-29_standings.json"
                }
            }
        }]}
    update_players(event, None)

## LOCAL TESTING ##
if __name__ == "__main__":
    print("Testing Locally")
    # test_utc_from_filekey()
    test_update_players()
