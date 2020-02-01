const express = require("express");

const server = express();

server.use(express.json());

let projects = [];
let requests = 0;

server.use((request, response, next) => {
  requests += 1;
  console.log(`Requests: ${requests}`);

  return next();
});

function projectExists(request, response, next) {
  const { id } = request.params;
  const projectInArray = projects.some(
    project => Number(project.id) === Number(id)
  );

  if (!projectInArray) {
    return response.status(400).json({ error: "Project does not exists" });
  }

  return next();
}

server.post("/projects", (request, response) => {
  const { id, title } = request.body;

  projects.push({
    id,
    title,
    tasks: []
  });

  return response.json(projects);
});

server.get("/projects", (request, response) => {
  return response.json(projects);
});

server.put("/projects/:id", projectExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;

  projects.forEach((project, index) => {
    if (Number(project.id) === Number(id)) {
      projects[index].title = title;
    }
  });

  return response.json(projects);
});

server.delete("/projects/:id", projectExists, (request, response) => {
  const { id } = request.params;

  projects = projects.filter(project => {
    return Number(project.id) !== Number(id);
  });

  return response.send();
});

server.post("/projects/:id/tasks", projectExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;

  projects.forEach((project, index) => {
    if (Number(project.id) === Number(id)) {
      projects[index].tasks.push(title);
    }
  });

  return response.json(projects);
});

server.listen(3333);
