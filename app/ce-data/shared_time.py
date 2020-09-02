import datetime, time
from datetime import timedelta  

def datetime_from_epoch_seconds(epoch_seconds):
    return datetime.datetime.fromtimestamp(epoch_seconds)

def datetime_from_epoch_milliseconds(epoch_milliseconds):
    epoch_milliseconds = int(epoch_milliseconds)
    epoch_seconds = epoch_milliseconds / 1000 # remove milliseconds
    return datetime.datetime.fromtimestamp(epoch_seconds)
