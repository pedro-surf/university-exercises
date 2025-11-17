'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.sequelize.query(`
    INSERT INTO usuario (nome, sobrenome, email, password, cidade, phone_number, date_of_birth, gender, role, address, created_by, created_at, updated_at)
VALUES
    ('John', 'Doe', 'johndoe@example.com', '$2b$10$N6o7aui/yQs5aCNhz79jMuScN/1Qohl0/tdXyOFOUvtrkfrVITsq6', 'City', '1234567890', '1990-01-01', 'Male', 'estudante', 'Address 1', NULL, now(), now()),
    ('Paul', 'Hahn', 'paul@example.com', '$2b$10$N6o7aui/yQs5aCNhz79jMuScN/1Qohl0/tdXyOFOUvtrkfrVITsq6', 'City', '1234567890', '1990-01-01', 'Male', 'estudante', 'Address 3', NULL, now(), now()),
    ('Jane', 'Smith', 'professor@example.com', '$2b$10$yarl7/zIAJEvOOCPGKN59eHVsejp.oxR/sBbGfyETjnBWDxuPVK6m', 'City', '0987654321', '1992-02-02', 'Female', 'professor', 'Address 2', NULL, now(), now()),
    ('Karla', 'Pereira', 'professora@example.com', '$2b$10$yarl7/zIAJEvOOCPGKN59eHVsejp.oxR/sBbGfyETjnBWDxuPVK6m', 'City', '0987654321', '1992-02-02', 'Female', 'professor', 'Address 2', NULL, now(), now());


INSERT INTO local (nome, sala, endereco, capacidade, created_at)
VALUES
    ('UFSC Florianopolis', 'Sala 1', 'Address 1', 100, now()),
    ('UFSC Araranguá', 'Sala 2', 'Address 2', 200, now());


INSERT INTO evento (title, professor_id, start_at, end_at, local_id, description, created_at)
VALUES
    ('Evento 1', (SELECT usuario_id FROM usuario WHERE nome = 'Jane' AND sobrenome = 'Smith'), '2023-07-01 10:00:00', '2023-07-01 12:00:00', (SELECT local_id FROM local WHERE nome = 'UFSC Araranguá'), 'Description 1', now()),
    ('Evento 2', (SELECT usuario_id FROM usuario WHERE nome = 'Jane' AND sobrenome = 'Smith'), '2023-07-02 14:00:00', '2023-07-02 16:00:00', (SELECT local_id FROM local WHERE nome = 'UFSC Araranguá'), 'Description 2', now());


INSERT INTO projeto (title, professor_id, start_at, end_at, local_id, description, created_at)
VALUES
    ('Projeto 1', (SELECT usuario_id FROM usuario WHERE sobrenome = 'Smith'), '2023-08-01 09:00:00', '2023-08-05 18:00:00', (SELECT local_id FROM local WHERE nome = 'UFSC Florianopolis'), 'Description 1', now()),
    ('Projeto 2', (SELECT usuario_id FROM usuario WHERE sobrenome = 'Smith'), '2023-09-01 09:00:00', '2023-09-05 18:00:00', (SELECT local_id FROM local WHERE nome = 'UFSC Araranguá'), 'Description 2', now()),
    ('Projeto 3', (SELECT usuario_id FROM usuario WHERE sobrenome = 'Pereira'), '2023-10-01 09:00:00', '2023-10-05 18:00:00', (SELECT local_id FROM local WHERE nome = 'UFSC Florianopolis'), 'Description 3', now());


INSERT INTO curso (title, professor_id, credit_hours, local_id, description, start_at, end_at, created_at)
VALUES
    ('Curso 1', (SELECT usuario_id FROM usuario WHERE nome = 'Jane'), 3, (SELECT local_id FROM local WHERE nome = 'UFSC Florianopolis'), 'Description 1', '2023-07-01 09:00:00', '2023-07-02 12:00:00', now()),
    ('Curso 2', (SELECT usuario_id FROM usuario WHERE nome = 'Jane'), 3, (SELECT local_id FROM local WHERE nome = 'UFSC Florianopolis'), 'Description 1', '2023-07-03 13:00:00', '2023-07-05 12:00:00', now());
    
INSERT INTO inscricao_evento (evento_id, usuario_id, created_at)
VALUES
    ((SELECT evento_id FROM evento WHERE title = 'Evento 1'), (SELECT usuario_id FROM usuario WHERE sobrenome = 'Doe'), now()),
    ((SELECT evento_id FROM evento WHERE title = 'Evento 2'), (SELECT usuario_id FROM usuario WHERE sobrenome = 'Hahn'), now());

INSERT INTO inscricao_projeto (projeto_id, usuario_id, created_at)
VALUES
    ((SELECT projeto_id FROM projeto WHERE title = 'Projeto 1'), (SELECT usuario_id FROM usuario WHERE sobrenome = 'Doe'), now()),
    ((SELECT projeto_id FROM projeto WHERE title = 'Projeto 1'), (SELECT usuario_id FROM usuario WHERE sobrenome = 'Hahn'), now()),
    ((SELECT projeto_id FROM projeto WHERE title = 'Projeto 2'), (SELECT usuario_id FROM usuario WHERE sobrenome = 'Doe'), now()),
    ((SELECT projeto_id FROM projeto WHERE title = 'Projeto 2'), (SELECT usuario_id FROM usuario WHERE sobrenome = 'Hahn'), now()),
    ((SELECT projeto_id FROM projeto WHERE title = 'Projeto 3'), (SELECT usuario_id FROM usuario WHERE sobrenome = 'Doe'), now()),
    ((SELECT projeto_id FROM projeto WHERE title = 'Projeto 3'), (SELECT usuario_id FROM usuario WHERE sobrenome = 'Hahn'), now());

INSERT INTO inscricao_curso (curso_id, usuario_id, created_at)
VALUES
    ((SELECT curso_id FROM curso WHERE title = 'Curso 1'), (SELECT usuario_id FROM usuario WHERE sobrenome = 'Doe'), now());

INSERT INTO certificado (evento_id, usuario_id, degree_name, credit_hours)
VALUES
    ((SELECT evento_id FROM evento WHERE title = 'Evento 1'), (SELECT usuario_id FROM usuario WHERE sobrenome = 'Doe'), 'Participação em evento', 10),
    ((SELECT evento_id FROM evento WHERE title = 'Evento 2'), (SELECT usuario_id FROM usuario WHERE sobrenome = 'Doe'), 'Participação em evento', 15),
    ((SELECT evento_id FROM evento WHERE title = 'Evento 1'), (SELECT usuario_id FROM usuario WHERE sobrenome = 'Hahn'), 'Participação em evento', 10);
    
INSERT INTO presenca_projeto (inscricao_projeto_id, attended) VALUES
    ((SELECT inscricao_projeto_id FROM inscricao_projeto WHERE projeto_id = (SELECT projeto_id FROM projeto WHERE title = 'Projeto 1') AND usuario_id = (SELECT usuario_id FROM usuario WHERE sobrenome = 'Doe')), true),
    ((SELECT inscricao_projeto_id FROM inscricao_projeto WHERE projeto_id = (SELECT projeto_id FROM projeto WHERE title = 'Projeto 1') AND usuario_id = (SELECT usuario_id FROM usuario WHERE sobrenome = 'Hahn')), true),
    ((SELECT inscricao_projeto_id FROM inscricao_projeto WHERE projeto_id = (SELECT projeto_id FROM projeto WHERE title = 'Projeto 2') AND usuario_id = (SELECT usuario_id FROM usuario WHERE sobrenome = 'Doe')), true),
    ((SELECT inscricao_projeto_id FROM inscricao_projeto WHERE projeto_id = (SELECT projeto_id FROM projeto WHERE title = 'Projeto 3') AND usuario_id = (SELECT usuario_id FROM usuario WHERE sobrenome = 'Hahn')), true);
    `);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
