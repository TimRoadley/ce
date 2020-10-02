import datetime
import dynamo


def utc_from_date_string(date_string):
    # INPUT "2020-09-23"
    x = datetime.datetime.strptime(date_string, "%Y-%m-%d")
    x = x.timestamp()
    return int(x)

def bench(bench_name, bench_date, players):
    recorded = utc_from_date_string(bench_date)
    data = {
        "bench_date": bench_date,
        "players": players,
        "recorded": recorded,
    }
    table = dynamo.table_cebench
    index = 'bench_name-recorded-index'
    key = 'bench_name'
    value = bench_name
    dynamo.generic_update(table, index, key, value, data, timestamp_key='recorded', timestamp_value=recorded)

## LOCAL TESTING ##
if __name__ == "__main__":

    print("Updating bench...")

    # Wed Sep 16: Cabbage, Londonboys, Kaleo, Deniter
    # bench("raider", "2020-09-16", ["Cabbage","Londonboys","Kaleo","Deniter"])

    # Mon Sep 21: Ohhai, Faceslicer, Berian, Deniter, Playgu, Maedre, Zither, Goraz
    # bench("raider", "2020-09-21", ["Ohhai","Berian","Deniter","Playgu","Maedre","Zither","Gorazzmatazz"])

    # Wed Sep 23: Borettoo, Condition, Xraid, Dirtyfire, Sivin, Enigmá, Deniter
    # bench("raider", "2020-09-23", ["Enigmá","Borettoo", "Condition", "Xraid", "Dirtyfire", "Sivin", "Deniter"])

    # Wed Sep 30: Willikins
    # bench("raider", "2020-09-30", ["Willikins"])
