import datetime
import dynamo


def utc_from_date_string(date_string):
    # INPUT "2020-09-23"
    x = datetime.datetime.strptime(date_string, "%Y-%m-%d")
    x = x.timestamp()
    return int(x)


def bench_player(player_name, date_string):

    recorded = utc_from_date_string(date_string)
    print("Benching", player_name, date_string, recorded)

    # Update cebench
    data = {
        "display_date": date_string,
        "recorded": recorded
    }
    dynamo.generic_update(dynamo.table_cebench, 'name-recorded-index',
                          'name', player_name, data, timestamp_key='recorded')


def bench_players(players, date_string):
    for player in players:
        bench_player(player, date_string)


## LOCAL TESTING ##
if __name__ == "__main__":

    print("Updating bench")

    # Wed Sep 16: Cabbage, Londonboys, Kaleo, Deniter
    # date_string = "2020-09-16"
    # benched_players = ["Cabbage","Londonboys","Kaleo","Deniter"]
    # bench_players(benched_players, date_string)

    # Mon Sep 21: Ohhai, Faceslicer, Berian, Deniter, Playgu, Maedre, Zither, Goraz
    # date_string = "2020-09-21"
    # benched_players = ["Ohhai","Berian","Deniter","Playgu","Maedre","Zither","Gorazzmatazz"]
    # bench_players(benched_players, date_string)

    # Wed Sep 23: Borettoo, Condition, Xraid, Dirtyfire, Sivin, Enigmá, Deniter
    # date_string = "2020-09-23"
    # benched_players = ["Borettoo", "Condition", "Xraid", "Dirtyfire", "Sivin", "Enigmá", "Deniter"]
    # bench_players(benched_players, date_string)

    # Mon Sep 23: Borettoo, Condition, Xraid, Dirtyfire, Sivin, Enigmá, Deniter
    date_string = "2020-09-28"
    benched_players = []
    bench_players(benched_players, date_string)

