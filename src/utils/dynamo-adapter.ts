import * as aws from "aws-sdk";
import { v4 } from "uuid";

let docClient;
// connect to local DB if running offline
if (process.env.IS_OFFLINE) {
  // console.log("--- Dynamo is offline!");
  docClient = new aws.DynamoDB.DocumentClient({
    region: "localhost",
    endpoint: "http://localhost:8000",
  });
} else {
  docClient = new aws.DynamoDB.DocumentClient({
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: process.env.AWS_REGION,
  });
}

export async function searchEntities({
  tableName,
  attributesToGet,
  searchText,
  field,
}: {
  tableName: string;
  attributesToGet?: string[];
  searchText: string;
  field: string;
}) {
  const entities = await getEntities(tableName, attributesToGet);
  const regex = new RegExp(searchText);
  return entities.filter((e) => regex.test(e[field]));
}
export async function getEntities(
  tableName,
  ids?: string[],
  key = "id",
  attributesToGet?: string[]
) {
  if (ids !== undefined && ids?.length > 0) {
    const params = {
      RequestItems: {
        [tableName]: {
          Keys: ids.map((id) => ({ [key]: id })),
        },
      },
      ...(attributesToGet ? { AttributesToGet: attributesToGet } : {}),
    };
    console.log("-------- params", JSON.stringify(params));
    return docClient
      .batchGet(params)
      .promise()
      .then((data) => {
        const res = data.Responses ?? [];
        return res[tableName] ?? [];
      });
  } else {
    const params = {
      TableName: tableName,
      ...(attributesToGet ? { AttributesToGet: attributesToGet } : {}),
    };
    return docClient
      .scan(params)
      .promise()
      .then((data) => {
        // console.log("--- getEntities", tableName, JSON.stringify(data));
        return data.Items ?? [];
      });
  }
}

const _end = (length, i, joinString) => (i + 1 < length ? joinString : "");
const _eq = (i, query, keyName, keyCount, condition = " AND ") =>
  `${query}${keyName} = :${keyName}${i}${_end(keyCount, i, " AND ")}`;

const _buildIdQuery = (ids: string[], key = "id", condition?: string) => {
  const query = ids.reduce((query, val, i) => {
    const res = _eq(i, query, key, ids.length, condition);
    return res;
  }, "");
  return query;
};
const _buildQuery = (
  keys: Record<string, string | number>,
  condition?: string
) => {
  const query = Object.keys(keys).reduce((query, key, i) => {
    const res = _eq(i, query, key, Object.keys(keys).length, condition);
    return res;
  }, "");
  return query;
};

const _buildExpressionAttibuteValues = (
  keys: Record<string, string | number>
) => {
  return Object.keys(keys).reduce(
    (e, key, i) => ({ ...e, [`:${key}${i}`]: keys[key] }),
    {}
  );
};

const _buildIdExpressionAttibuteValues = (ids: string[], key = "id") => {
  return ids.reduce((e, val, i) => ({ ...e, [`:${key}${i}`]: { S: val } }), {});
};

const _buildFilterExpression = (keys: Record<string, string | number>) => {
  return Object.keys(keys).reduce(
    (acc, key, i) => `${acc}${key}, :${key}${i})`,
    `contains(`
  );
};

const _buildKeyConditionExpression = (
  keys: Record<string, string | number>
) => {
  return Object.keys(keys).reduce(
    (acc, key, i) => `${acc}${key} = :${key}${i})`,
    ``
  );
};

export async function searchIn({
  tableName,
  attributesToGet,
  searchText,
  field,
}: {
  tableName: string;
  attributesToGet?: string[];
  searchText: string;
  field: string;
}) {
  const keys = { [field]: searchText };
  const params = {
    TableName: tableName,
    FilterExpression: _buildFilterExpression(keys),
    ExpressionAttributeValues: _buildExpressionAttibuteValues(keys),
  };
  // console.log("--- params", JSON.stringify(params, null, 2));

  return docClient
    .scan(params)
    .promise()
    .then((data) => {
      console.log(
        "---  SearchIn",
        tableName,
        JSON.stringify(data),
        JSON.stringify(data.Items)
      );
      return data.Items;
    });
}

export async function getIndexedEntities(
  tableName: string,
  indexName: string,
  keys: Record<string, string | number>
) {
  const params = {
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: _buildQuery(keys),
    ExpressionAttributeValues: _buildExpressionAttibuteValues(keys),
  };
  // console.log("--- params", JSON.stringify(params, null, 2));

  return docClient
    .query(params)
    .promise()
    .then((data) => {
      // console.log(
      //   "--- getIndexedEntities",
      //   tableName,
      //   JSON.stringify(data),
      //   JSON.stringify(data.Items)
      // );
      return data.Items;
    });
}
export async function getEntity(tableName, id, attributesToGet?: string[]) {
  const params = {
    TableName: tableName,
    Key: {
      id: `${id}`,
    },
    ...(attributesToGet ? { AttributesToGet: attributesToGet } : {}),
  };
  return docClient
    .get(params)
    .promise()
    .then((data) => {
      // console.log("---getEntity", tableName, JSON.stringify(data));
      return data && data.Item;
    });
}

export async function createEntity(tableName, entity) {
  // set an id if not set
  // console.log('--- createEntity', entity);
  const createdAt = new Date();
  entity = { ...entity, id: entity.id ? entity.id : v4() };
  entity = { ...entity, createdAt: createdAt.getTime() };
  const params = {
    TableName: tableName,
    Item: entity,
  };
  // console.log('--- entity params', JSON.stringify(params));
  return docClient
    .put(params)
    .promise()
    .then(() => entity);
}

export async function deleteEntity(tableName, id, idName = "id") {
  const params = {
    TableName: tableName,
    Key: {
      [idName]: id,
    },
  };
  // console.log('--- delete entity', id);
  return docClient
    .delete(params)
    .promise()
    .then((err, data) => {
      if (err !== undefined && err.length > 0) {
        const msg = `DeleteItem failed:, ${JSON.stringify(err, null, 2)}`;
        console.error(msg);
        return { msg: new Error(msg) };
      } else {
        const msg = `DeleteItem succeeded:, ${JSON.stringify(data, null, 2)}`;
        // console.log(msg);
        return { msg };
      }
    });
}

export async function deleteAll(tableName) {
  const entities = await getEntities(tableName);
  // console.log('---- delete all', entities);
  return new Promise((resolve) => {
    entities.forEach(async (e) => await deleteEntity(tableName, e.id));
    resolve(entities);
  });
}

export async function updateEntity(tableName, entity, idName = "id") {
  // set an id if not set
  if (!entity[idName])
    throw new Error("Id was null when trying to update an entity");
  // console.log('--- update entity', JSON.stringify(entity));
  const params = {
    TableName: tableName,
    Item: entity,
  };
  return docClient
    .put(params)
    .promise()
    .then(() => entity);
}
