import dynamo

## TESTS ##
def test_create():
    table = dynamo.table_ceplayer
    index = 'name-index'
    key = 'name'
    value = 'Testplayer1'
    data = {"rank":"Class Leader", "class":"Priest"}
    dynamo.generic_create(table, index, key, value, data)

def test_read():
    table = dynamo.table_ceplayer
    index = 'name-index'
    key = 'name'
    value = 'Testplayer1'
    x = dynamo.generic_read(table, index, key, value)
    print(x)

def test_update():
    table = dynamo.table_ceplayer
    index = 'name-index'
    key = 'name'
    value = 'Testplayer1'
    data = {"rank":"Raider", "class":"Warlock"}
    dynamo.generic_update(table, index, key, value, data)

def test_delete():
    table = dynamo.table_ceplayer
    key = 'name'
    value = 'Testplayer1'
    dynamo.generic_delete(table, key, value)

## LOCAL TESTING ##
if __name__ == "__main__":
    print("Testing Locally")
    #test_create()
    #test_read()
    #test_update()
    test_delete()
