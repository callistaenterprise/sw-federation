import {
  searchEntities,
  createEntity,
  getEntities,
  deleteEntity,
  deleteAll,
  getEntity,
  updateEntity,
  getIndexedEntities,
  searchIn,
} from "./dynamo-adapter";

export class Service {
  tableName;
  constructor(tableName) {
    this.tableName = tableName;
  }
  create = async (entity) => {
    return await createEntity(this.tableName, entity);
  };

  update = async (entity) => {
    return await updateEntity(this.tableName, entity);
  };

  list = async (ids?: string[]) => {
    return await getEntities(this.tableName, ids);
  };

  indexedEntities = async (indexName, keys) => {
    return await getIndexedEntities(this.tableName ?? "", indexName, keys);
  };

  get = async (id) => getEntity(this.tableName, id);

  search = async (searchText, field = "") =>
    searchEntities({
      field,
      tableName: this.tableName ?? "",
      searchText,
    });

  searchInList = async (searchText, field = "") =>
    searchIn({
      field,
      tableName: this.tableName ?? "",
      searchText,
    });

  remove = async (id) => deleteEntity(this.tableName, id);

  removeAll = async () => deleteAll(this.tableName);
}
