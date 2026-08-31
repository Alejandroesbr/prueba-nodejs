--
-- PostgreSQL database dump
--

\restrict lZnBk4abHehcJJhXmerpxwDUC8qVVTmR57NWs0lIBegif4nWPuFgXwseQM1rPaf

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_clinics_status; Type: TYPE; Schema: public; Owner: db_admin
--

CREATE TYPE public.enum_clinics_status AS ENUM (
    'ACTIVE',
    'DELETED'
);


ALTER TYPE public.enum_clinics_status OWNER TO db_admin;

--
-- Name: enum_inventory_status; Type: TYPE; Schema: public; Owner: db_admin
--

CREATE TYPE public.enum_inventory_status AS ENUM (
    'ACTIVE',
    'DELETED'
);


ALTER TYPE public.enum_inventory_status OWNER TO db_admin;

--
-- Name: enum_medications_status; Type: TYPE; Schema: public; Owner: db_admin
--

CREATE TYPE public.enum_medications_status AS ENUM (
    'ACTIVE',
    'DELETED'
);


ALTER TYPE public.enum_medications_status OWNER TO db_admin;

--
-- Name: enum_requests_status; Type: TYPE; Schema: public; Owner: db_admin
--

CREATE TYPE public.enum_requests_status AS ENUM (
    'PENDING',
    'ASSIGNED',
    'APPROVED',
    'IN_PROGRESS',
    'REJECTED',
    'COMPLETED',
    'CANCELLED',
    'DELETED'
);


ALTER TYPE public.enum_requests_status OWNER TO db_admin;

--
-- Name: enum_warehouses_status; Type: TYPE; Schema: public; Owner: db_admin
--

CREATE TYPE public.enum_warehouses_status AS ENUM (
    'ACTIVE',
    'DELETED'
);


ALTER TYPE public.enum_warehouses_status OWNER TO db_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: clinics; Type: TABLE; Schema: public; Owner: db_admin
--

CREATE TABLE public.clinics (
    id uuid NOT NULL,
    name character varying(150) NOT NULL,
    nit character varying(30) NOT NULL,
    manager_name character varying(150) NOT NULL,
    manager_phone character varying(30) NOT NULL,
    status public.enum_clinics_status DEFAULT 'ACTIVE'::public.enum_clinics_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.clinics OWNER TO db_admin;

--
-- Name: inventory; Type: TABLE; Schema: public; Owner: db_admin
--

CREATE TABLE public.inventory (
    id uuid NOT NULL,
    warehouse_id uuid NOT NULL,
    medication_id uuid NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    status public.enum_inventory_status DEFAULT 'ACTIVE'::public.enum_inventory_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.inventory OWNER TO db_admin;

--
-- Name: medications; Type: TABLE; Schema: public; Owner: db_admin
--

CREATE TABLE public.medications (
    id uuid NOT NULL,
    name character varying(150) NOT NULL,
    description character varying(255),
    status public.enum_medications_status DEFAULT 'ACTIVE'::public.enum_medications_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.medications OWNER TO db_admin;

--
-- Name: requests; Type: TABLE; Schema: public; Owner: db_admin
--

CREATE TABLE public.requests (
    id uuid NOT NULL,
    clinic_id uuid NOT NULL,
    medication_id uuid NOT NULL,
    warehouse_id uuid NOT NULL,
    quantity integer NOT NULL,
    status public.enum_requests_status DEFAULT 'PENDING'::public.enum_requests_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.requests OWNER TO db_admin;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: db_admin
--

CREATE TABLE public.roles (
    id uuid NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO db_admin;

--
-- Name: users; Type: TABLE; Schema: public; Owner: db_admin
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO db_admin;

--
-- Name: warehouses; Type: TABLE; Schema: public; Owner: db_admin
--

CREATE TABLE public.warehouses (
    id uuid NOT NULL,
    name character varying(150) NOT NULL,
    location character varying(255) NOT NULL,
    status public.enum_warehouses_status DEFAULT 'ACTIVE'::public.enum_warehouses_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.warehouses OWNER TO db_admin;

--
-- Data for Name: clinics; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY public.clinics (id, name, nit, manager_name, manager_phone, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY public.inventory (id, warehouse_id, medication_id, quantity, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: medications; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY public.medications (id, name, description, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY public.requests (id, clinic_id, medication_id, warehouse_id, quantity, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY public.roles (id, name, description, created_at, updated_at) FROM stdin;
8c215dd2-38f4-4fa0-8b51-b2a912f1b72b	ADMIN	Infrastructure Administrator	2026-08-31 16:44:01.642+00	2026-08-31 16:44:01.642+00
05fa6de4-00bf-4aa0-9aec-047d96f62a22	REQUEST_MANAGER	Manages medication supply requests	2026-08-31 16:44:01.65+00	2026-08-31 16:44:01.65+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY public.users (id, email, password_hash, role_id, created_at, updated_at) FROM stdin;
59cac199-9c57-43d0-92cd-e4a2840ebc2f	testuser@example.com	$2b$12$FRnGjIeE9cTrQi2fKWBsfutNMjeITDbrQEsDHmUhmryT/Aptn.Oh.	8c215dd2-38f4-4fa0-8b51-b2a912f1b72b	2026-08-31 16:45:52.473+00	2026-08-31 16:45:52.473+00
\.


--
-- Data for Name: warehouses; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY public.warehouses (id, name, location, status, created_at, updated_at) FROM stdin;
d3b07384-d113-4ec2-a25e-336c091324a1	North warehouses	Industrial warehouse 4	ACTIVE	2026-08-31 16:46:45.277+00	2026-08-31 16:46:45.277+00
e9c18208-c770-4fd1-a4dc-3af0fd273633	Central warehouses	Central city	ACTIVE	2026-08-31 16:46:45.279+00	2026-08-31 16:46:45.279+00
\.


--
-- Name: clinics clinics_nit_key; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_nit_key UNIQUE (nit);


--
-- Name: clinics clinics_nit_key1; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_nit_key1 UNIQUE (nit);


--
-- Name: clinics clinics_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- Name: medications medications_name_key; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.medications
    ADD CONSTRAINT medications_name_key UNIQUE (name);


--
-- Name: medications medications_name_key1; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.medications
    ADD CONSTRAINT medications_name_key1 UNIQUE (name);


--
-- Name: medications medications_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.medications
    ADD CONSTRAINT medications_pkey PRIMARY KEY (id);


--
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_name_key1; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key1 UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_email_key1; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key1 UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: warehouses warehouses_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_pkey PRIMARY KEY (id);


--
-- Name: inventory_warehouse_id_medication_id; Type: INDEX; Schema: public; Owner: db_admin
--

CREATE UNIQUE INDEX inventory_warehouse_id_medication_id ON public.inventory USING btree (warehouse_id, medication_id);


--
-- Name: roles_name; Type: INDEX; Schema: public; Owner: db_admin
--

CREATE UNIQUE INDEX roles_name ON public.roles USING btree (name);


--
-- Name: users_email; Type: INDEX; Schema: public; Owner: db_admin
--

CREATE UNIQUE INDEX users_email ON public.users USING btree (email);


--
-- Name: inventory inventory_medication_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_medication_id_fkey FOREIGN KEY (medication_id) REFERENCES public.medications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: inventory inventory_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: requests requests_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: requests requests_medication_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_medication_id_fkey FOREIGN KEY (medication_id) REFERENCES public.medications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: requests requests_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict lZnBk4abHehcJJhXmerpxwDUC8qVVTmR57NWs0lIBegif4nWPuFgXwseQM1rPaf

