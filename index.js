import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "TodoList",
  password: "123456",
  port: 5432,
})

db.connect()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [

];

async function getItems() {
  try {
    const items = await db.query("select * from items order by id asc");
    return items.rows;
  } catch (error) {
    console.error('Error executing query');
    throw error;
  }
}

app.get("/", async (req, res) => {

  try {
    items = [];
    let result = await getItems();
    // console.log(typeof result)
    result.forEach((item) => {
      items.push(item);
    })

    console.log(items)

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (error) {
    console.log(error)
  }
});

app.post("/add", async (req, res) => {
  try {
    const item = req.body.newItem;
    // console.log(item)
    await db.query("insert into items(title) values($1)", [item])
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }

});

app.post("/edit", async (req, res) => {
  try {
    const updateItem = req.body.updatedItemTitle;
    const id = req.body.updatedItemId;

    await db.query("update items set title = $1 where id = $2", [updateItem, id])
    res.redirect("/");

  } catch (error) {
    console.log(error);
  }
});

app.post("/delete", async (req, res) => {
  try {
    const id = req.body.deleteItemId;
    console.log(id)
    await db.query("delete from items where id = $1", [id]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
 });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
