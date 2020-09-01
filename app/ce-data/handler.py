import boto3, os, sys, uuid, json
from urllib.parse import unquote_plus

def load_json(filename):
    with open(filename) as f:
        return json.load(f)

def update_players(event, context):

    print('## EVENT')
    print(event)

    records = 0
    data = {}
    for record in event['Records']:
        records += 1
        bucket = record['s3']['bucket']['name'] # ce-standings
        key = unquote_plus(record['s3']['object']['key']) # 2020/2020-07-29_standings.json
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
                player_gp = player[3]
                player_ep = player[4]
                player_priority = player[5]
                if player_gp == 0 and player_ep == 100 and player_priority == 0:
                    print('Skipped inactive',player_rank,player_class,player_name)
                else:
                    print('>>> UPDATING',player_rank,player_class,player_name,"GP",player_gp,"EP",player_ep,"PRIORITY",player_priority)


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
