'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE TYPE user_type AS ENUM (
      'estudante',
      'professor',
      'visitante'
    )`);

    await queryInterface.sequelize.query(`CREATE TABLE IF NOT EXISTS usuario (
      usuario_id uuid NOT NULL DEFAULT gen_random_uuid(),
      nome text NOT NULL,
      sobrenome text NOT NULL,
      email text NOT NULL,
      password text NOT NULL,
      cidade text NOT NULL,
      phone_number text,
      date_of_birth timestamp with time zone,
      gender text,
      role user_type NOT NULL DEFAULT 'estudante'::user_type,
      address text,
      created_by uuid,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      updated_at timestamp with time zone NOT NULL DEFAULT now(),
      PRIMARY KEY (usuario_id),
      unique (email)
    )`);

    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS local (
      local_id uuid NOT NULL DEFAULT gen_random_uuid(),
      nome text NOT NULL,
      sala text NOT NULL,
      endereco text NOT NULL,
      capacidade integer NOT NULL,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      PRIMARY KEY (local_id)
      )
    `);

    await queryInterface.sequelize.query(`CREATE TABLE IF NOT EXISTS evento (
    evento_id uuid NOT NULL DEFAULT gen_random_uuid(),
    title text NOT NULL,
    professor_id uuid REFERENCES usuario (usuario_id),
    start_at timestamp with time zone NOT NULL,
    end_at timestamp with time zone NOT NULL,
    local_id uuid REFERENCES local (local_id),
    description text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (evento_id)
    )`);

    await queryInterface.sequelize.query(`CREATE TABLE IF NOT EXISTS projeto (
      projeto_id uuid NOT NULL DEFAULT gen_random_uuid(),
      title text NOT NULL,
      professor_id uuid REFERENCES usuario (usuario_id),
      start_at timestamp with time zone NOT NULL,
      end_at timestamp with time zone NOT NULL,
      local_id uuid REFERENCES local (local_id),
      description text,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      PRIMARY KEY (projeto_id)
      )`);

    await queryInterface.sequelize.query(`CREATE TABLE IF NOT EXISTS curso (
    curso_id uuid NOT NULL DEFAULT gen_random_uuid(),
    title text NOT NULL,
    professor_id uuid REFERENCES usuario (usuario_id),
    credit_hours integer NOT NULL,
    local_id uuid REFERENCES local (local_id),
    description text,
    start_at timestamp with time zone NOT NULL,
    end_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (curso_id)
      )`
    );

    await queryInterface.sequelize.query(`CREATE TABLE IF NOT EXISTS inscricao_projeto (
      inscricao_projeto_id uuid NOT NULL DEFAULT gen_random_uuid(),
      usuario_id uuid NOT NULL references usuario (usuario_id),
      projeto_id uuid NOT NULL references projeto (projeto_id),
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      PRIMARY KEY (inscricao_projeto_id)
      )`);


    await queryInterface.sequelize.query(`CREATE TABLE IF NOT EXISTS inscricao_curso (
    inscricao_curso_id uuid NOT NULL DEFAULT gen_random_uuid(),
    usuario_id uuid NOT NULL references usuario (usuario_id),
    curso_id uuid NOT NULL references curso (curso_id),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (inscricao_curso_id)
    )`);

    await queryInterface.sequelize.query(`CREATE TABLE IF NOT EXISTS inscricao_evento (
      inscricao_evento_id uuid NOT NULL DEFAULT gen_random_uuid(),
      usuario_id uuid NOT NULL references usuario (usuario_id),
      evento_id uuid NOT NULL REFERENCES evento (evento_id),
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      PRIMARY KEY (inscricao_evento_id)
    )`);

    await queryInterface.sequelize.query(`CREATE TABLE IF NOT EXISTS presenca_curso (
      presenca_curso_id uuid NOT NULL DEFAULT gen_random_uuid(),
      inscricao_curso_id uuid NOT NULL REFERENCES inscricao_curso (inscricao_curso_id),
      attended boolean NOT NULL DEFAULT true,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      PRIMARY KEY (presenca_curso_id)
      )`
    );

    await queryInterface.sequelize.query(`CREATE TABLE IF NOT EXISTS presenca_evento (
      presenca_evento_id uuid NOT NULL DEFAULT gen_random_uuid(),
      inscricao_evento_id uuid NOT NULL REFERENCES inscricao_evento (inscricao_evento_id),
      attended boolean NOT NULL DEFAULT true,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      PRIMARY KEY (presenca_evento_id)
      )`
    );

    await queryInterface.sequelize.query(`CREATE TABLE IF NOT EXISTS presenca_projeto (
        presenca_projeto_id uuid NOT NULL DEFAULT gen_random_uuid(),
        inscricao_projeto_id uuid NOT NULL REFERENCES inscricao_projeto (inscricao_projeto_id),
        attended boolean NOT NULL DEFAULT true,
        created_at timestamp with time zone NOT NULL DEFAULT now(),
        PRIMARY KEY (presenca_projeto_id)
        )`
    );


    await queryInterface.sequelize.query(`CREATE TABLE IF NOT EXISTS certificado (
    certificado_id uuid NOT NULL DEFAULT gen_random_uuid(),
    degree_name text NOT NULL,
    credit_hours integer NOT NULL,
    curso_id uuid REFERENCES curso (curso_id),
    evento_id uuid REFERENCES evento (evento_id),
    projeto_id uuid REFERENCES projeto (projeto_id),
    usuario_id uuid NOT NULL REFERENCES usuario (usuario_id),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (certificado_id)
    )`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP TABLE inscricao_curso`);

    await queryInterface.sequelize.query(`DROP TABLE inscricao_evento`);

    await queryInterface.sequelize.query(`DROP TABLE inscricao_projeto`);

    await queryInterface.sequelize.query(`DROP TABLE presenca_curso`);

    await queryInterface.sequelize.query(`DROP TABLE presenca_evento`);

    await queryInterface.sequelize.query(`DROP TABLE evento`);

    await queryInterface.sequelize.query(`DROP TABLE certificado`);

    await queryInterface.sequelize.query(`DROP TABLE curso`);

    await queryInterface.sequelize.query(`DROP TABLE projeto`);

    await queryInterface.sequelize.query(`DROP TABLE local`);

    await queryInterface.sequelize.query(`DROP TABLE usuario`);

    await queryInterface.sequelize.query(`DROP TYPE user_type`);
  }
};
