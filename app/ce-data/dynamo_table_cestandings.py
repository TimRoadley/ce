import dynamo

def DEPRECATED_read_range(name, start, end, fields):
        
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

## TESTS ##
def test_create():
    table = dynamo.table_cestanding
    index = 'name-recorded-index'
    key = 'name'
    value = 'zzzTestUser1'
    data = {"ep":123, "gp":456, "priority": 34, "recorded": 1599028357 }
    dynamo.generic_create(table, index, key, value, data, 'recorded')

    value = 'zzzTestUser2'
    data = {"ep":456, "gp":789, "priority": 56, "recorded": 1599028400 }
    dynamo.generic_create(table, index, key, value, data, 'recorded')

    value = 'zzzTestUser3'
    data = {"ep":789, "gp":23, "priority": 77, "recorded": 1599028500 }
    dynamo.generic_create(table, index, key, value, data, 'recorded')

def test_read():
    table = dynamo.table_cestanding
    index = 'name-index'
    key = 'name'
    value = 'zzzTestUser1'
    x = dynamo.generic_read(table, index, key, value)
    print(x)

## LOCAL TESTING ##
if __name__ == "__main__":
    print("Testing Locally")
    test_create()
    # test_read()
    # test_read_range()
    # test_update()
