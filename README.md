# IGO Run QC

Application that displays all post sequencing stats for IGO to make pass/fail/deliver decisions for samples and projects.

## Development Setup
### Frontend

1) Setup
    ```
    cd frontend
    npm install
    npm run start           # application should be started on localhost:3000
    ```  

2) Cookie - Place cookie in session w/ localhost as domain
    - Log into https://igodev.mskcc.org/login/
    - Upon successful authentication, change `Domain` of cookie from `igodev.mskcc.org` to `localhost`. This makes the cookie available in your local application. See image and guide below for more information about changing your cookie. NOTE - If the `.env` `JWT_SECRET` doesn't match that of igo-dev, the cookie will be invalid)
    - Navigate back to `localhost:3000`, which should now have the session cookie to make requests

**In Chrome**: 

DevTools > Application > Storage:Cookies > Select Domain > Modify domain value of cookie w/ `jic` to `localhost`).
![Modify_Cookie](https://developers.google.com/web/tools/chrome-devtools/storage/imgs/clearallcookies.png)
Reference - [View, Edit, And Delete Cookies With Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/storage/cookies)

### Backend
1) Configurations - Update `.env` file

2) Run
```
cd backend
npm install
npm run start
```