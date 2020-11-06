const noteService = {
  getAllNotes: (knex) => {
    return knex.select("*").from("noteful_notes");
  },
  insertNote: async (knex, note) => {
    const rows = await knex
      .insert(note)
      .into("noteful_notes")
      .returning("*");
    return rows[0];
  },
  getNoteById: (knex, id) => {
    return knex.select("*").from("noteful_notes").where({ id }).first();
  },
  updateNote: (knex, id, note) => {
    return knex("noteful_notes").where({ id }).update(note);
  },
  deleteNote: (knex, id) => {
    return knex("noteful_notes").where({ id }).delete();
  },
};

module.exports = noteService