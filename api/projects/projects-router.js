// Write your "projects" router here!
const express = require("express")
const router = express.Router();
const Projects = require('./projects-model');
router.use(express.json());

router.get('/',(req,res) =>{
    Projects.get().then(projects =>{
        if(!projects){
            res.status(200).json([])
        }else{
            res.status(200).json(projects)
        }
    }).catch(() =>{
        res.status(500).json({
            message: "error getting items"
        })
    })
})

router.get("/:id", (req,res) =>{
    Projects.get(req.params.id).then(project =>{
        if(!project){
            res.status(404).json({
                message: "The project with this id was not found"
            })
        }else{
            res.status(200).json(project)
        }
    }).catch(() =>{
        res.status(500).json({
            message: "Error getting the id"
        })
    })
})

router.put('/:id', (req, res) => {
    if (!req.body.name || !req.body.description || !req.body.completed) {
      res.status(400).json({ message: 'Name and description required' });
    } else {
      Projects.update(req.params.id, req.body)
        .then((updatedProject) => {
          if (updatedProject) {
            return Projects.get(req.params.id);
          } else {
            res.status(404).json({
              message: 'The project with the specified id does not exist',
            });
          }
        })
        .then((updatedProject) => {
          res.status(200).json(updatedProject);
        })
        .catch(() => {
          res.status(500).json({ message: 'Put error' });
        });
    }
  });
  
  router.delete('/:id', (req, res) => {
    Projects.remove(req.params.id)
      .then((deletedProject) => {
        if (!deletedProject) {
          res.status(404).json({
            message: 'The project with the specified id does not exist',
          });
        } else {
          res.status(200).json();
        }
      })
      .catch(() => {
        res.status(500).json({ message: 'Delete error' });
      });
  });
  
  router.get('/:id/actions', (req, res) => {
    Projects.get(req.params.id)
      .then((actions) => {
        if (!actions) {
          res.status(404).json({
            message: 'The project with the specified id does not exist',
          });
        } else {
          Projects.getProjectActions(req.params.id).then((actions) => {
            res.status(200).json(actions);
          });
        }
      })
      .catch(() => {
        res.status(500).json({ message: 'Get actions error' });
      });
  });


module.exports = router