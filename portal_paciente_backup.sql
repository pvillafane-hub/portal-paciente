--
-- PostgreSQL database dump
--

\restrict JXG51gKh6z11yTynpqsQG93xKimuPl8sh28QYaBNeSY73hQFl8CWYx8zCPc9kdL

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Document; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Document" (
    id text NOT NULL,
    "userId" text NOT NULL,
    filename text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "filePath" text NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "docType" text NOT NULL,
    facility text NOT NULL,
    "studyDate" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Document" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: Document; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Document" (id, "userId", filename, "createdAt", "filePath", "deletedAt", "docType", facility, "studyDate") FROM stdin;
6089e454-d471-42e2-9233-21884c18db78	test-user-1	Carta de prestamo Adrian.pdf	2026-01-05 18:51:13.128	/uploads/1767639073081-Carta de prestamo Adrian.pdf	\N	Rayos X	Hospital Manati Medical Center	2026-01-05 00:00:00
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email) FROM stdin;
test-user-1	test@local.dev
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
e025022d-638b-485a-93d4-b56a83a1e4e6	eb5f3fa08212b3419dea91e1b94acefe270927d4b3f09ef5df0eff580fae6929	2026-01-05 12:00:37.506569-04	20260105160037_init	\N	\N	2026-01-05 12:00:37.481635-04	1
70ab2ea5-efc9-4b5d-a970-97da3fd7cb41	a4d31a3029198d0052add86fe4a288fa03e550f83d1af65347b70dfbc413a79b	2026-01-05 13:53:40.737437-04	20260105175340_add_file_path	\N	\N	2026-01-05 13:53:40.727971-04	1
570f3648-b9da-4858-a075-932925edf1c3	823d662020e968dfc9d778bee42c5d8a6e8b154181888b47fe6d817ac4ab59ec	2026-01-05 14:33:14.760948-04	20260105183314_add_metadata	\N	\N	2026-01-05 14:33:14.752957-04	1
\.


--
-- Name: Document Document_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "Document_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Document Document_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict JXG51gKh6z11yTynpqsQG93xKimuPl8sh28QYaBNeSY73hQFl8CWYx8zCPc9kdL

