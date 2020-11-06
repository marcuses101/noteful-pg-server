require('dotenv').config();
const {expect} = require('chai');
const knex = require('knex')
const supertest = require('supertest')
const makeFolderArray = require('./folder.fixtures');
const makeNoteArray = require('./note.fixtures')
const app = require ('../src/app')

describe("Folder endpoints", ()=>{
  let db = {};
  before('make knex instance', ()=>{
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    })
    return app.set('db',db)

  })

  before("clean the tables", ()=>{
   return db.raw("TRUNCATE noteful_notes, noteful_folders RESTART IDENTITY CASCADE")
  })
  afterEach('cleanup',()=>{
   return db.raw("TRUNCATE noteful_notes, noteful_folders RESTART IDENTITY CASCADE")
  })
  after("disconnect from db",()=>{
   return db.destroy();
  })

  context("Given there are folders and notes in the database",()=>{
    describe('/api/folder route',()=>{
      beforeEach('insert data into noteful_folders and noteful_notes',async ()=>{
      await db.insert(makeFolderArray()).into('noteful_folders');
      return db.insert(makeNoteArray()).into('noteful_notes')
      })
      afterEach('cleanup',()=>{
       return db.raw("TRUNCATE noteful_notes, noteful_folders RESTART IDENTITY CASCADE")
      })

      it('GET responds with 200 and all the folders',()=>{
        const folders = makeFolderArray().map((folder,i)=>{
          folder.id = i+1;
          return folder;
        });
        return supertest(app)
        .get('/api/folder')
        .expect(200)
        .then(res=>expect(res.body).to.eql(folders))
      })



    })
    describe('/api/folder/:id',()=>{})
  })
  context("Given the database is empty", ()=>{
    describe('/api/folder route',()=>{
      it('POST creates an folder, responding with 201 and the new folder', function (){
        this.retries(3)
        const newFolder = {
          name: "New Folder"
        }
        return supertest(app)
        .post('/api/folder')
        .send(newFolder)
        .expect(201)
        .expect(res=> {
          expect(res.body).to.eql({id:1,...newFolder})
          expect(res.headers.location).to.eql(`/api/folder/${res.body.id}`)
        })
      })
    })
  })
})