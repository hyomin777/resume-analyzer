from sqlalchemy import Table, Column, Integer, String, MetaData

metadata = MetaData()

TEST_TABLE = Table(
    "test",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer),
    Column("content", String)
)
