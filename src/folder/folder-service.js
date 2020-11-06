const folderService = {
  getAllFolders: (knex) => {
    return knex.select("*").from("noteful_folders");
  },
  insertFolder: async (knex, folder) => {
    const rows = await knex
      .insert(folder)
      .into("noteful_folders")
      .returning("*");
    return rows[0];
  },
  getFolderById: (knex, id) => {
    return knex.select("*").from("noteful_folders").where({ id }).first();
  },
  updateFolder: (knex, id, folder) => {
    return knex("noteful_folders").where({ id }).update(folder);
  },
  deleteFolder: (knex, id) => {
    return knex("noteful_folders").where({ id }).delete();
  },
};

module.exports = folderService;
