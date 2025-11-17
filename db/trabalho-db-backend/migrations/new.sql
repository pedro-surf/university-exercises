SELECT "owner"."nome",
 COUNT(*) AS "count",
 "owner"."usuario_id" AS "owner.usuario_id",
 "owner"."nome" AS "owner.nome",
 "owner"."sobrenome" AS "owner.sobrenome",
 "owner"."role" AS "owner.role",
 "owner"."email" AS "owner.email",
 "owner"."cidade" AS "owner.cidade",
 "owner"."created_by" AS "owner.created_by",
 "owner"."created_at" AS "owner.created_at",
 "owner"."updated_at" AS "owner.updated_at",
 "evento"."evento_id" AS "evento.evento_id",
 "evento"."professor_id" AS "evento.professor_id",
 "evento"."title" AS "evento.title",
 "evento"."local_id" AS "evento.local_id",
 "evento"."start_at" AS "evento.start_at",
 "evento"."end_at" AS "evento.end_at",
 "evento"."description" AS "evento.description",
 "evento"."created_at" AS "evento.created_at",
 "evento->local"."local_id" AS "evento.local.local_id",
 "evento->local"."nome" AS "evento.local.nome",
 "evento->local"."sala" AS "evento.local.sala",
 "evento->local"."endereco" AS "evento.local.endereco",
 "evento->local"."capacidade" AS "evento.local.capacidade"
 FROM "certificado" AS "Certificado"
 LEFT OUTER JOIN "usuario" AS "owner" ON "Certificado"."usuario_id" = "owner"."usuario_id"
 LEFT OUTER JOIN (
    "evento" AS "evento"
    INNER JOIN "local" AS "evento->local"
    ON "evento"."local_id" = "evento->local"."local_id"
    AND "evento->local"."nome" ILIKE 'ufsc ararangua'
    )
ON "Certificado"."evento_id" = "evento"."evento_id"
GROUP BY
"owner"."usuario_id",
 "evento"."evento_id",
 "evento->local"."local_id"
 ORDER BY "count" DESC;