const express = require("express")
const db = require("./db")
const server = express()
const port = 500

server.use(express.json())

// User Registration
server.post("/user/register", (req, res) => {
  const { username, email, password } = req.body

  db.run(
    "INSERT INTO USERS(USERNAME, EMAIL, PASSWORD) VALUES(?, ?, ?)",
    [username, email, password],
    (err) => {
      if (err) {
        if (err.code === "SQLITE_CONSTRAINT") {
          return res.status(400).send("Email already exists")
        }
        return res.status(500).send("Database Error")
      }
      res.status(200).send("Registration successful, account created.")
    }
  )
})

// Admin Login
server.post("/admin/login", (req, res) => {
    const { username, password } = req.body
    if (username === "noorChef" && password === "chef") {
        return res.status(200).send("Admin login successful")
    } else {
        return res.status(401).send("Invalid admin credentials")
    }
})
  
// User Login
server.post("/user/login", (req, res) => {
  const { username, password } = req.body

  db.get("SELECT * FROM USERS WHERE USERNAME = ? AND PASSWORD = ?", 
  [username, password], 
  (err, row) => {
    if (err || !row) {
      return res.status(401).send("Invalid credentials")
    }
    res.status(200).send("Login successful")
  })
})

// Add Recipe
server.post("/add_recipe", (req, res) => {
  const { title, ingredients, instructions } = req.body

  db.run(
    "INSERT INTO RECIPES (TITLE, INGREDIENTS, INSTRUCTIONS) VALUES (?, ?, ?)",
    [title, ingredients, instructions],
    (err) => {
      if (err) {
        console.error("Error adding recipe:", err.message)
        return res.status(500).send("Error adding recipe")
      }
      res.status(200).send("Recipe added successfully")
    })
})

// View Recipes
server.get("/recipes", (req, res) => {
  db.all("SELECT * FROM RECIPES", (err, rows) => {
    if (err) {
      console.error("Error retrieving recipes:", err.message)
      return res.status(500).send("Error retrieving recipes")
    }
    res.status(200).json(rows)
  })
})

// Edit Recipe
server.put("/edit_recipe/:id", (req, res) => {
    const recipeId = req.params.id
    const { title, ingredients, instructions } = req.body
  
    db.run(
      "UPDATE RECIPES SET TITLE = ?, INGREDIENTS = ?, INSTRUCTIONS = ? WHERE ID = ?",
      [title, ingredients, instructions, recipeId],
      (err) => {
        if (err) {
          console.error("Error editing recipe:", err.message)
          return res.status(500).send("Error editing recipe")
        }
        res.status(200).send("Recipe updated successfully")
      }
    )
  })

// Delete Recipe
server.delete("/delete_recipe/:id", (req, res) => {
  const recipeId = req.params.id

  db.run("DELETE FROM RECIPES WHERE ID = ?", [recipeId], (err) => {
    if (err) {
      console.error("Error deleting recipe:", err.message)
      return res.status(500).send("Error deleting recipe")
    }
    res.status(200).send("Recipe deleted successfully")
  })
})

//Suggest Recipe
server.post("/suggest_recipe", (req, res) => {
    const { title, userId } = req.body
  
    db.run(
      "INSERT INTO SUGGESTIONS (TITLE, USER_ID) VALUES (?, ?)",
      [title, userId],
      (err) => {
        if (err) {
          console.error("Error suggesting recipe:", err.message)
          return res.status(500).send("Error suggesting recipe")
        }
        res.status(200).send("Recipe suggestion submitted successfully")
    })
  })

// Leave Feedback
server.post("/leave_feedback", (req, res) => {
    const { recipeId, userId, comment } = req.body
  
    db.run(
      "INSERT INTO FEEDBACKS (RECIPE_ID, USER_ID, COMMENT) VALUES (?, ?, ?)",
      [recipeId, userId, comment],
      (err) => {
        if (err) {
          console.error("Error leaving feedback:", err.message)
          return res.status(500).send("Error leaving feedback")
        }
        res.status(200).send("Feedback submitted successfully")
      })
  })

// View Feedback for a Recipe
server.get("/feedback/:recipeId", (req, res) => {
    const recipeId = req.params.recipeId
  
    db.all("SELECT * FROM FEEDBACKS WHERE RECIPE_ID = ?", [recipeId], (err, rows) => {
      if (err) {
        console.error("Error retrieving feedback:", err.message)
        return res.status(500).send("Error retrieving feedback")
      }
      res.status(200).json(rows)
    })
  })

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

module.exports = server 