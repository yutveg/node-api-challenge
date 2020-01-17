const express = require("express");

const router = express.Router();
const Projects = require("../data/helpers/projectModel.js");
const Actions = require("../data/helpers/actionModel.js");

// Projects CRUD

router.get("/", (req, res) => {
  Projects.get()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({ error: "Something went wrong." });
    });
});

router.get("/:id", validateProjectId, (req, res) => {
  Projects.get(req.params.id)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({ error: "Something went wrong." });
    });
});

router.post("/", validateProjectPost, (req, res) => {
  Projects.insert(req.body)
    .then(result => {
      res.status(200).json({ message: "Creation was successful." });
    })
    .catch(err => {
      res.status(500).json({ error: "Something went wrong." });
    });
});

router.delete("/:id", validateProjectId, (req, res) => {
  Projects.remove(req.params.id)
    .then(result => {
      res.status(200).json({ message: "Deletion was successful." });
    })
    .catch(err => {
      res.status(500).json({ error: "Something went wrong." });
    });
});

router.put("/:id", validateProjectId, (req, res) => {
  Projects.update(req.params.id, req.body)
    .then(result => {
      res.status(200).json({ message: "Update was successful." });
    })
    .catch(err => {
      res.status(500).json({ error: "Something went wrong." });
    });
});

// Actions CRUD

router.post(
  "/:id/actions",
  validateProjectId,
  validateActionPost,
  (req, res) => {
    Actions.insert({
      project_id: req.params.id,
      description: req.body.description,
      notes: req.body.notes
    })
      .then(result => {
        res.status(200).json({ message: "Creation was successful." });
      })
      .catch(err => {
        res.status(500).json({ error: "Something went wrong." });
      });
  }
);

router.get("/:id/actions", validateProjectId, (req, res) => {
  Projects.getProjectActions(req.params.id)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({ error: "Something went wrong." });
    });
});

router.get(
  "/:id/actions/:actionid",
  validateProjectId,
  validateActionId,
  (req, res) => {
    Projects.getProjectActions(req.params.id)
      .then(result => {
        res.status(200).send(result[req.params.actionid - 1]);
      })
      .catch(err => {
        res.status(500).json({ error: "Something went wrong." });
      });
  }
);

router.put(
  "/:id/actions/:actionid",
  validateProjectId,
  validateActionId,
  (req, res) => {
    Actions.update(req.params.actionid, {
      project_id: req.params.id,
      description: req.body.description,
      notes: req.body.notes
    })
      .then(result => {
        res.status(200).json({ message: "Update was successful." });
      })
      .catch(err => {
        res.status(500).json({ error: "Something went wrong." });
      });
  }
);

router.delete("/:id/actions/:actionid", (req, res) => {
  Actions.remove(req.params.actionid)
    .then(result => {
      res.status(200).json({ message: "Deletion was successful." });
    })
    .catch(err => {
      res.status(500).json({ error: "Something went wrong." });
    });
});

// bit of middleware

function validateProjectId(req, res, next) {
  Projects.get(req.params.id).then(result => {
    result === null
      ? res.status(400).json({ error: "project not found" })
      : next();
  });
}

function validateActionId(req, res, next) {
  Actions.get(req.params.actionid).then(result => {
    result === null
      ? res.status(400).json({ error: "action not found" })
      : next();
  });
}

function validateProjectPost(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ error: "No content for post detected" });
  } else if (!req.body.name || !req.body.description) {
    res.status(400).json({ error: "Please include all required fields." });
  } else next();
}

function validateActionPost(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ error: "No content for post detected" });
  } else if (!req.body.description || !req.body.notes) {
    res.status(400).json({ error: "Please include all required fields." });
  } else next();
}

module.exports = router;
