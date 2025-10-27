# Car-Owner-Identifier

> Bachelor project — a full-stack system to detect vehicle license plates in images, recognize plate characters, and link plates with owner data.

This repository contains three main parts:

- `client/` — React (React Native) application providing the mobile UI and authentication flows.
- `server/` — Java Spring Boot backend providing REST endpoints, user management, and a license-plate data store.
- `microservice/` — Python-based computer-vision service that performs license-plate detection and character recognition (YOLO-based detection + character classifier).

## Highlights

- End-to-end flow: image upload -> plate detection -> OCR -> backend stores/returns matched owner info.
- Modular architecture so the detection model (microservice) can be trained and replaced independently.
- Built as a bachelor thesis / capstone project.

## Table of contents

- [Architecture](#architecture)
- [Repository layout](#repository-layout)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
  - [Run the microservice (vision)](#run-the-microservice-vision)
  - [Run the server (backend)](#run-the-server-backend)
  - [Run the client (mobile/React app)](#run-the-client-mobilereact-app)
- [Notable files & where to look](#notable-files--where-to-look)
- [Training notes](#training-notes)
- [Next steps / suggestions](#next-steps--suggestions)
- [License & author](#license--author)

## Architecture

The system consists of three cooperating components:

- Client (`client/`): UI for users to login/register, upload or capture images, and view results. The app calls the backend API.
- Backend (`server/`): Java Spring Boot project. Handles authentication, users, and license-plate entities. Accepts processed results from the microservice (or forwards images to it) and stores/retrieves data in the server-side data store.
- Microservice (`microservice/`): Python scripts and models that run object detection on images (YOLO) and a character-recognition model for each character of the plate. Exposes a programmatic interface (see `server` integration inside `server` controllers).

All three parts are intentionally decoupled so they can be developed and deployed independently.

## Repository layout

Top-level folders (short):

- `client/` — front-end application (React / React Native). Entry: `client/App.js`.
- `microservice/` — vision service and model code. Entry scripts include `microservice/server.py`, `microservice/detect.py`, `microservice/detect_image.py`, and training code like `train_char.py`.
- `server/` — Java backend with Spring Boot layout under `server/src/main/java/com/licenta/`.

## Prerequisites

Install the appropriate runtimes for each component you plan to run:

- Node.js (>=16 recommended) and npm or yarn — for the `client`.
- Java JDK (11 or 17 recommended) and Maven/Gradle — for `server` (Spring Boot).
- Python 3.8+ and a virtual environment; PyTorch, OpenCV, and other ML packages — for `microservice`.

Notes:

- The repository currently does not include pinned package manifests for every component (for example, a `requirements.txt` inside `microservice/` may be missing). See the section below on assumptions and verification.

## Quick start

These steps assume you will run the components locally on the same machine. Adjust host/ports and environment variables if you split them or use Docker.

### Run the microservice (vision)

1. Create and activate a Python virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

2. Install requirements. There may not be a `requirements.txt` in the repo — if one is missing, install typical packages used here:

```bash
pip install torch torchvision opencv-python flask numpy pillow
```

3. Start the microservice. There are several entry scripts in `microservice/`; `server.py` looks like an API entrypoint:

```bash
python microservice/server.py
```

If the microservice exposes a REST endpoint, the backend can POST images or requests to it. Inspect `microservice/server.py` for port and route details.

### Run the server (backend)

1. From the `server/` folder, build & run the Spring Boot app. If this is a Maven project:

```bash
cd server
mvn spring-boot:run
```

Or use your IDE (IntelliJ/Eclipse) to run `BackendLicentaApplication.java` under `server/src/main/java/com/licenta/`.

2. Configuration is in `server/src/main/resources/application.properties`. Update database connection strings or other settings as needed.

3. The controllers are under `server/src/main/java/com/licenta/controller/` — for example `LicensePlateController.java` and `UserController.java`. These expose the API the client calls.

### Run the client (mobile/React app)

1. Install Node.js dependencies and run the app:

```bash
cd client
# install deps
npm install
# start the dev server (React Native / Expo or web start depending on project)
npm start
```

2. The main entry is `client/App.js` and navigation/screens are in `client/Apps/screens/`. Look at `client/Apps/screens/Routes.jsx` for routing and the per-screen components in the subfolders.

3. The client uses a custom axios wrapper under `client/components/axios/axiosComplex.jsx` and context in `client/components/contextCreds/`.

## Notable files & where to look

- Client
  - `client/App.js` — app entry
  - `client/Apps/screens/` — screens (Login, Register, Home, Detect, Debug)
  - `client/components/axios/axiosComplex.jsx` — HTTP client wrapper

- Server
  - `server/src/main/java/com/licenta/BackendLicentaApplication.java` — Spring Boot entry
  - `server/src/main/java/com/licenta/controller/` — controllers (REST endpoints)
  - `server/src/main/java/com/licenta/dto/` — DTOs used by controllers
  - `server/src/main/resources/application.properties` — configuration

- Microservice
  - `microservice/server.py` — likely the microservice entrypoint
  - `microservice/detect.py`, `microservice/detect_image.py` — detection utilities
  - `microservice/train_char.py` — training a character classifier
  - `microservice/models/` and `microservice/src/char_classification/model.py` — model code

## Training notes

- The microservice contains training code (see `train_char.py` and `microservice/src/char_classification/model.py`). Training typically requires a GPU and a dataset of character crops with labels.
- Keep checkpoints and model artifacts separate from this repo (large files). If you train locally, export the trained model to a `models/` folder and update the microservice to load it.

## Assumptions & verification hints

- I kept commands general because the repo may be missing manifest files (for example, `pom.xml` or `requirements.txt`) or may use different tooling (Gradle or Maven wrapper, Yarn vs npm, Expo vs plain React Native). Please verify:
  - `server/` contains a `pom.xml` or `build.gradle` to choose the correct Java build/run command.
  - `microservice/` contains a `requirements.txt` or `environment.yml` to recreate the Python environment. If not present, create one listing packages you used during development.
  - `client/` package manifest (`package.json`) determines the correct start commands.

If you want, I can scan for `pom.xml`, `package.json`, or `requirements.txt` and update the README with exact commands.

## Contact & author

This is a bachelor project by Iuliu Andrei Steau (project files are in this repository). For details about the thesis or to request datasets/models, open an issue or contact the author directly.


