# Flirting Education💕
## Welcome to Flirting School🖐😍

<img src="https://img.shields.io/badge/npm-EF9421?style=for-the-badge&logo=Npm&logoColor=white"> <img src="https://img.shields.io/badge/React-1D1D1D?style=for-the-badge&logo=React&logoColor=#0371B5"> <img src="https://img.shields.io/badge/ReactQuery-9D1620?style=for-the-badge&logo=ReactQuery&logoColor=white"> <img src="https://img.shields.io/badge/Electron-002050?style=for-the-badge&logo=Electron&logoColor=white"> <img src="https://img.shields.io/badge/Node.js-FFFFFF?style=for-the-badge&logo=Node.js&logoColor=#339933">

> Note: Electron과 웹소켓, 리액트쿼리 공부를 위해 시작한 디스코드 테마 사이드 프로젝트입니다. 퍼블리싱보다 프로젝트 구조나 리액트쿼리 활용에 좀 더 비중을 두고 있습니다.

## Table of Contents

_Note: This is only a navigation guide for the specification, and does not define or mandate terms for any specification-compliant documents._

- [Sections](#sections)
  - 📚 [FILE STRUCTURE](#file-structure)
  - 👀 [Preview](#preview)
  - 🛠 [Usage](#usage)
  - 👧‍👦 [Contributing](#contributing)
  - [License](#license)
- [Definitions](#definitions)

## SECTIONS

### 📚CROSS BROWSING

- 크롬 계열

### 📚FILE STRUCTURE

```
- 📂 public
    - 📄 electron.ts : electron config file
    - 📄 preload.js : electron preload
- 📂 src
  - 📂 assets
    - 📂 fonts
    - 📂 images
    - 📂 scss
    - 📂 ts
- 📂 components
- 📂 layouts
- 📂 pages
- 📂 typings
- 📂 utils
- 📂 hooks
  - 📄 useBoolean : 모달 open, hidden을 위한 hooks
  - 📄 useInputs : input 값 handle을 위한 hook
- ✅📄 tsconfig.json : js설정파일 (추가할 경로가 있을 경우 이 파일에서 셋팅한다.)
```

### 👀PREVIEW

![ezgif com-gif-maker](https://user-images.githubusercontent.com/57129686/192136718-c8bec531-4f0a-4d49-aac1-98c6215df769.gif)


### 🛠Usage
Backen 실행 후 Front 실행 

Backend (mysql 설치 필요)
```
  npm install
  cd server

  npm i bcrypt && npm i
  .env 작성하기(COOKIE_SECRET과 본인 PC의 MYSQL_PASSWORD 비밀번호 설정)
  COOKIE_SECRET=cookienyamnyam
  MYSQL_PASSWORD=디비비번
  config/config.json 설정(MYSQL 접속 설정)
  npx sequelize db:create(스키마 생성)
  npm run dev했다가 ctrl + c로 끄기(테이블 생성)
  npx sequelize db:seed:all(기초 데이터 넣기)
  npm run dev
```

Frontend
```
  npm install
  cd client
  npm run electron
```


### 👩‍👩‍👧‍👦contributing

- Frontend: kimdoeun😎
- Backend: ZeroCho ( 인프런 Sleact 강좌 참고하여 임시 구성 ) 
