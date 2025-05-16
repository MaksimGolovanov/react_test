├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── src
│       ├── App.css
│       ├── App.js
│       ├── Components
│       │   ├── button
│       │   │   ├── buttonLogout.js
│       │   │   └── style.module.css
│       │   ├── circle
│       │   │   ├── Circle.js
│       │   │   └── Circle.module.css
│       │   ├── Clock.js
│       │   ├── NavBar
│       │   │   ├── NavBar.css
│       │   │   └── NavBar.js
│       │   └── Table
│       │       ├── style.module.css
│       │       └── Table.js
│       ├── features
│       │   ├── admin
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── Admin.css
│       │   │   │   ├── Admin.js
│       │   │   │   ├── AdminCreate.js
│       │   │   │   ├── AdminEditUser.js
│       │   │   │   ├── LoginPage.js
│       │   │   │   ├── PrivateRoute.js
│       │   │   │   └── RoleSprav.js
│       │   │   ├── routes.js
│       │   │   ├── services
│       │   │   │   └── AdminService.js
│       │   │   └── store
│       │   │       └── UserStore.js
│       │   ├── ib
│       │   │   ├── components
│       │   │   │   └── image
│       │   │   │       └── i.jpg
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── ib.js
│       │   │   │   ├── instructions.js
│       │   │   │   └── style.module.css
│       │   │   └── routes.js
│       │   ├── ip
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── ipaddress.js
│       │   │   │   └── style.module.css
│       │   │   ├── routes.js
│       │   │   ├── services
│       │   │   │   └── IpService.js
│       │   │   └── store
│       │   │       └── IpStore.js
│       │   ├── ius-pt
│       │   │   ├── components
│       │   │   │   ├── ButtonAll
│       │   │   │   │   ├── ButtonAll.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── IusAdm
│       │   │   │   │   └── IusAdm.js
│       │   │   │   ├── SearchInput
│       │   │   │   │   ├── SearchInput.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── SpravRole
│       │   │   │   │   ├── AddRoleModal.js
│       │   │   │   │   ├── SpravRole.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── StopRoles
│       │   │   │   │   ├── StopRoles.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── UserRoles
│       │   │   │   │   ├── AddOverRoleModal.js
│       │   │   │   │   ├── RoleGroup.js
│       │   │   │   │   ├── RoleRow.js
│       │   │   │   │   ├── RoleSelectionModal.js
│       │   │   │   │   ├── RoleSubGroup.js
│       │   │   │   │   ├── RoleTable.js
│       │   │   │   │   ├── RoleTableHeader.js
│       │   │   │   │   ├── style.module.css
│       │   │   │   │   └── UserRoles.js
│       │   │   │   ├── UserRolesPage
│       │   │   │   │   ├── style.module.css
│       │   │   │   │   └── UserRolesPage.js
│       │   │   │   └── UserTable
│       │   │   │       ├── EditUserModal.js
│       │   │   │       ├── style.module.css
│       │   │   │       └── UserTable.js
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── IusPt.js
│       │   │   │   ├── IusPtUser.js
│       │   │   │   ├── IusSprav.js
│       │   │   │   ├── IusUserApplication.js
│       │   │   │   └── style.module.css
│       │   │   ├── routes.js
│       │   │   ├── services
│       │   │   │   └── IusPtService.js
│       │   │   └── store
│       │   │       └── IusPtStore.js
│       │   ├── json
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── json.js
│       │   │   │   └── style.module.css
│       │   │   └── routes.js
│       │   ├── notes
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── CreatePost.js
│       │   │   │   ├── EditPost.js
│       │   │   │   ├── Notes.css
│       │   │   │   └── Notes.js
│       │   │   ├── routes.js
│       │   │   └── services
│       │   │       └── NoteService.js
│       │   ├── prints
│       │   │   ├── components
│       │   │   │   ├── PrintAll.js
│       │   │   │   ├── PrintChart.js
│       │   │   │   ├── PrintCreateModal.js
│       │   │   │   ├── PrintEditModal.js
│       │   │   │   ├── PrinteEditLocationModal.js
│       │   │   │   ├── PrintLocation.js
│       │   │   │   ├── PrintModel.js
│       │   │   │   └── PrintModelCreateModal.js
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── Prints.css
│       │   │   │   └── Prints.js
│       │   │   └── services
│       │   │       └── PrintsService.js
│       │   └── staff
│       │       ├── index.js
│       │       ├── pages
│       │       │   ├── Staff.css
│       │       │   ├── Staff.js
│       │       │   ├── StaffCreateModal.js
│       │       │   ├── StaffEditModal.js
│       │       │   ├── StaffImportModal.js
│       │       │   ├── StaffSprav.js
│       │       │   ├── StaffSpravDepartments.js
│       │       │   └── style.module.css
│       │       ├── routes.js
│       │       ├── services
│       │       │   └── StaffService.js
│       │       └── store
│       │           └── UserStore.js
│       ├── Image
│       │   ├── 13506.750.jpg
│       │   ├── christmas-plains.png
│       │   ├── ib.jpg
│       │   ├── Landscaping-Logo.png
│       │   ├── plug1.jpg
│       │   ├── plug2.jpg
│       │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│       │   ├── UI.jpg
│       │   └── wordpress_web_security_header.jpg
│       ├── index.js
│       └── shared
│           └── PrivateRoute.js
└── server
    ├── .env
    ├── config
    │   └── config.json
    ├── controllers
    │   ├── DepartmentController.js
    │   ├── ipControllers.js
    │   ├── IusControllers
    │   │   ├── IusSpravAdmController.js
    │   │   ├── IusSpravRolesController.js
    │   │   ├── IusStopRolesConroller.js
    │   │   ├── IusUserController.js
    │   │   ├── IusUserRolesController.js
    │   │   └── StaffController.js
    │   ├── NoteController.js
    │   ├── PrintController.js
    │   ├── PrintModelController.js
    │   ├── StaffControllers.js
    │   └── UserControllers.js
    ├── db.js
    ├── error
    │   └── ApiError.js
    ├── migrations
    │   └── 20250505064536-add_new_field_to_prints.js
    ├── models
    │   ├── IusPtModels.js
    │   └── models.js
    ├── package-lock.json
    ├── package.json
    ├── routes
    │   ├── index.js
    │   ├── ipaddressRouter.js
    │   ├── iusRouter.js
    │   ├── notesRouter.js
    │   ├── printModelsRouter.js
    │   ├── printRouter.js
    │   ├── staffRouter.js
    │   └── userRouter.js
    ├── server.js
    ├── snmpPoller.js
    └── static
        ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
        ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
        ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
        ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
        ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
        ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
        ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
        ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
        ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
        ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
        ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
        ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
        ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
        ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
        ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
        ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
        ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
        ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
        ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
        ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
        ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
        ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
        ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
        ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
        ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
        ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
        ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
        ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
        └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── src
│       ├── App.css
│       ├── App.js
│       ├── Components
│       │   ├── button
│       │   │   ├── buttonLogout.js
│       │   │   └── style.module.css
│       │   ├── circle
│       │   │   ├── Circle.js
│       │   │   └── Circle.module.css
│       │   ├── Clock.js
│       │   ├── NavBar
│       │   │   ├── NavBar.css
│       │   │   └── NavBar.js
│       │   └── Table
│       │       ├── style.module.css
│       │       └── Table.js
│       ├── features
│       │   ├── admin
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── Admin.css
│       │   │   │   ├── Admin.js
│       │   │   │   ├── AdminCreate.js
│       │   │   │   ├── AdminEditUser.js
│       │   │   │   ├── LoginPage.js
│       │   │   │   ├── PrivateRoute.js
│       │   │   │   └── RoleSprav.js
│       │   │   ├── routes.js
│       │   │   ├── services
│       │   │   │   └── AdminService.js
│       │   │   └── store
│       │   │       └── UserStore.js
│       │   ├── ib
│       │   │   ├── components
│       │   │   │   └── image
│       │   │   │       └── i.jpg
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── ib.js
│       │   │   │   ├── instructions.js
│       │   │   │   └── style.module.css
│       │   │   └── routes.js
│       │   ├── ip
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── ipaddress.js
│       │   │   │   └── style.module.css
│       │   │   ├── routes.js
│       │   │   ├── services
│       │   │   │   └── IpService.js
│       │   │   └── store
│       │   │       └── IpStore.js
│       │   ├── ius-pt
│       │   │   ├── components
│       │   │   │   ├── ButtonAll
│       │   │   │   │   ├── ButtonAll.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── IusAdm
│       │   │   │   │   └── IusAdm.js
│       │   │   │   ├── SearchInput
│       │   │   │   │   ├── SearchInput.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── SpravRole
│       │   │   │   │   ├── AddRoleModal.js
│       │   │   │   │   ├── SpravRole.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── StopRoles
│       │   │   │   │   ├── StopRoles.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── UserRoles
│       │   │   │   │   ├── AddOverRoleModal.js
│       │   │   │   │   ├── RoleGroup.js
│       │   │   │   │   ├── RoleRow.js
│       │   │   │   │   ├── RoleSelectionModal.js
│       │   │   │   │   ├── RoleSubGroup.js
│       │   │   │   │   ├── RoleTable.js
│       │   │   │   │   ├── RoleTableHeader.js
│       │   │   │   │   ├── style.module.css
│       │   │   │   │   └── UserRoles.js
│       │   │   │   ├── UserRolesPage
│       │   │   │   │   ├── style.module.css
│       │   │   │   │   └── UserRolesPage.js
│       │   │   │   └── UserTable
│       │   │   │       ├── EditUserModal.js
│       │   │   │       ├── style.module.css
│       │   │   │       └── UserTable.js
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── IusPt.js
│       │   │   │   ├── IusPtUser.js
│       │   │   │   ├── IusSprav.js
│       │   │   │   ├── IusUserApplication.js
│       │   │   │   └── style.module.css
│       │   │   ├── routes.js
│       │   │   ├── services
│       │   │   │   └── IusPtService.js
│       │   │   └── store
│       │   │       └── IusPtStore.js
│       │   ├── json
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── json.js
│       │   │   │   └── style.module.css
│       │   │   └── routes.js
│       │   ├── notes
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── CreatePost.js
│       │   │   │   ├── EditPost.js
│       │   │   │   ├── Notes.css
│       │   │   │   └── Notes.js
│       │   │   ├── routes.js
│       │   │   └── services
│       │   │       └── NoteService.js
│       │   ├── prints
│       │   │   ├── components
│       │   │   │   ├── PrintAll.js
│       │   │   │   ├── PrintChart.js
│       │   │   │   ├── PrintCreateModal.js
│       │   │   │   ├── PrintEditModal.js
│       │   │   │   ├── PrinteEditLocationModal.js
│       │   │   │   ├── PrintLocation.js
│       │   │   │   ├── PrintModel.js
│       │   │   │   └── PrintModelCreateModal.js
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── Prints.css
│       │   │   │   └── Prints.js
│       │   │   └── services
│       │   │       └── PrintsService.js
│       │   └── staff
│       │       ├── index.js
│       │       ├── pages
│       │       │   ├── Staff.css
│       │       │   ├── Staff.js
│       │       │   ├── StaffCreateModal.js
│       │       │   ├── StaffEditModal.js
│       │       │   ├── StaffImportModal.js
│       │       │   ├── StaffSprav.js
│       │       │   ├── StaffSpravDepartments.js
│       │       │   └── style.module.css
│       │       ├── routes.js
│       │       ├── services
│       │       │   └── StaffService.js
│       │       └── store
│       │           └── UserStore.js
│       ├── Image
│       │   ├── 13506.750.jpg
│       │   ├── christmas-plains.png
│       │   ├── ib.jpg
│       │   ├── Landscaping-Logo.png
│       │   ├── plug1.jpg
│       │   ├── plug2.jpg
│       │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│       │   ├── UI.jpg
│       │   └── wordpress_web_security_header.jpg
│       ├── index.js
│       └── shared
│           └── PrivateRoute.js
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── src
│       ├── App.css
│       ├── App.js
│       ├── Components
│       │   ├── button
│       │   │   ├── buttonLogout.js
│       │   │   └── style.module.css
│       │   ├── circle
│       │   │   ├── Circle.js
│       │   │   └── Circle.module.css
│       │   ├── Clock.js
│       │   ├── NavBar
│       │   │   ├── NavBar.css
│       │   │   └── NavBar.js
│       │   └── Table
│       │       ├── style.module.css
│       │       └── Table.js
│       ├── features
│       │   ├── admin
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── Admin.css
│       │   │   │   ├── Admin.js
│       │   │   │   ├── AdminCreate.js
│       │   │   │   ├── AdminEditUser.js
│       │   │   │   ├── LoginPage.js
│       │   │   │   ├── PrivateRoute.js
│       │   │   │   └── RoleSprav.js
│       │   │   ├── routes.js
│       │   │   ├── services
│       │   │   │   └── AdminService.js
│       │   │   └── store
│       │   │       └── UserStore.js
│       │   ├── ib
│       │   │   ├── components
│       │   │   │   └── image
│       │   │   │       └── i.jpg
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── ib.js
│       │   │   │   ├── instructions.js
│       │   │   │   └── style.module.css
│       │   │   └── routes.js
│       │   ├── ip
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── ipaddress.js
│       │   │   │   └── style.module.css
│       │   │   ├── routes.js
│       │   │   ├── services
│       │   │   │   └── IpService.js
│       │   │   └── store
│       │   │       └── IpStore.js
│       │   ├── ius-pt
│       │   │   ├── components
│       │   │   │   ├── ButtonAll
│       │   │   │   │   ├── ButtonAll.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── IusAdm
│       │   │   │   │   └── IusAdm.js
│       │   │   │   ├── SearchInput
│       │   │   │   │   ├── SearchInput.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── SpravRole
│       │   │   │   │   ├── AddRoleModal.js
│       │   │   │   │   ├── SpravRole.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── StopRoles
│       │   │   │   │   ├── StopRoles.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── UserRoles
│       │   │   │   │   ├── AddOverRoleModal.js
│       │   │   │   │   ├── RoleGroup.js
│       │   │   │   │   ├── RoleRow.js
│       │   │   │   │   ├── RoleSelectionModal.js
│       │   │   │   │   ├── RoleSubGroup.js
│       │   │   │   │   ├── RoleTable.js
│       │   │   │   │   ├── RoleTableHeader.js
│       │   │   │   │   ├── style.module.css
│       │   │   │   │   └── UserRoles.js
│       │   │   │   ├── UserRolesPage
│       │   │   │   │   ├── style.module.css
│       │   │   │   │   └── UserRolesPage.js
│       │   │   │   └── UserTable
│       │   │   │       ├── EditUserModal.js
│       │   │   │       ├── style.module.css
│       │   │   │       └── UserTable.js
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── IusPt.js
│       │   │   │   ├── IusPtUser.js
│       │   │   │   ├── IusSprav.js
│       │   │   │   ├── IusUserApplication.js
│       │   │   │   └── style.module.css
│       │   │   ├── routes.js
│       │   │   ├── services
│       │   │   │   └── IusPtService.js
│       │   │   └── store
│       │   │       └── IusPtStore.js
│       │   ├── json
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── json.js
│       │   │   │   └── style.module.css
│       │   │   └── routes.js
│       │   ├── notes
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── CreatePost.js
│       │   │   │   ├── EditPost.js
│       │   │   │   ├── Notes.css
│       │   │   │   └── Notes.js
│       │   │   ├── routes.js
│       │   │   └── services
│       │   │       └── NoteService.js
│       │   ├── prints
│       │   │   ├── components
│       │   │   │   ├── PrintAll.js
│       │   │   │   ├── PrintChart.js
│       │   │   │   ├── PrintCreateModal.js
│       │   │   │   ├── PrintEditModal.js
│       │   │   │   ├── PrinteEditLocationModal.js
│       │   │   │   ├── PrintLocation.js
│       │   │   │   ├── PrintModel.js
│       │   │   │   └── PrintModelCreateModal.js
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── Prints.css
│       │   │   │   └── Prints.js
│       │   │   └── services
│       │   │       └── PrintsService.js
│       │   └── staff
│       │       ├── index.js
│       │       ├── pages
│       │       │   ├── Staff.css
│       │       │   ├── Staff.js
│       │       │   ├── StaffCreateModal.js
│       │       │   ├── StaffEditModal.js
│       │       │   ├── StaffImportModal.js
│       │       │   ├── StaffSprav.js
│       │       │   ├── StaffSpravDepartments.js
│       │       │   └── style.module.css
│       │       ├── routes.js
│       │       ├── services
│       │       │   └── StaffService.js
│       │       └── store
│       │           └── UserStore.js
│       ├── Image
│       │   ├── 13506.750.jpg
│       │   ├── christmas-plains.png
│       │   ├── ib.jpg
│       │   ├── Landscaping-Logo.png
│       │   ├── plug1.jpg
│       │   ├── plug2.jpg
│       │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│       │   ├── UI.jpg
│       │   └── wordpress_web_security_header.jpg
│       ├── index.js
│       └── shared
│           └── PrivateRoute.js
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── src
│       ├── App.css
│       ├── App.js
│       ├── Components
│       │   ├── button
│       │   │   ├── buttonLogout.js
│       │   │   └── style.module.css
│       │   ├── circle
│       │   │   ├── Circle.js
│       │   │   └── Circle.module.css
│       │   ├── Clock.js
│       │   ├── NavBar
│       │   │   ├── NavBar.css
│       │   │   └── NavBar.js
│       │   └── Table
│       │       ├── style.module.css
│       │       └── Table.js
│       ├── features
│       │   ├── admin
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── Admin.css
│       │   │   │   ├── Admin.js
│       │   │   │   ├── AdminCreate.js
│       │   │   │   ├── AdminEditUser.js
│       │   │   │   ├── LoginPage.js
│       │   │   │   ├── PrivateRoute.js
│       │   │   │   └── RoleSprav.js
│       │   │   ├── routes.js
│       │   │   ├── services
│       │   │   │   └── AdminService.js
│       │   │   └── store
│       │   │       └── UserStore.js
│       │   ├── ib
│       │   │   ├── components
│       │   │   │   └── image
│       │   │   │       └── i.jpg
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── ib.js
│       │   │   │   ├── instructions.js
│       │   │   │   └── style.module.css
│       │   │   └── routes.js
│       │   ├── ip
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── ipaddress.js
│       │   │   │   └── style.module.css
│       │   │   ├── routes.js
│       │   │   ├── services
│       │   │   │   └── IpService.js
│       │   │   └── store
│       │   │       └── IpStore.js
│       │   ├── ius-pt
│       │   │   ├── components
│       │   │   │   ├── ButtonAll
│       │   │   │   │   ├── ButtonAll.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── IusAdm
│       │   │   │   │   └── IusAdm.js
│       │   │   │   ├── SearchInput
│       │   │   │   │   ├── SearchInput.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── SpravRole
│       │   │   │   │   ├── AddRoleModal.js
│       │   │   │   │   ├── SpravRole.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── StopRoles
│       │   │   │   │   ├── StopRoles.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── UserRoles
│       │   │   │   │   ├── AddOverRoleModal.js
│       │   │   │   │   ├── RoleGroup.js
│       │   │   │   │   ├── RoleRow.js
│       │   │   │   │   ├── RoleSelectionModal.js
│       │   │   │   │   ├── RoleSubGroup.js
│       │   │   │   │   ├── RoleTable.js
│       │   │   │   │   ├── RoleTableHeader.js
│       │   │   │   │   ├── style.module.css
│       │   │   │   │   └── UserRoles.js
│       │   │   │   ├── UserRolesPage
│       │   │   │   │   ├── style.module.css
│       │   │   │   │   └── UserRolesPage.js
│       │   │   │   └── UserTable
│       │   │   │       ├── EditUserModal.js
│       │   │   │       ├── style.module.css
│       │   │   │       └── UserTable.js
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── IusPt.js
│       │   │   │   ├── IusPtUser.js
│       │   │   │   ├── IusSprav.js
│       │   │   │   ├── IusUserApplication.js
│       │   │   │   └── style.module.css
│       │   │   ├── routes.js
│       │   │   ├── services
│       │   │   │   └── IusPtService.js
│       │   │   └── store
│       │   │       └── IusPtStore.js
│       │   ├── json
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── json.js
│       │   │   │   └── style.module.css
│       │   │   └── routes.js
│       │   ├── notes
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── CreatePost.js
│       │   │   │   ├── EditPost.js
│       │   │   │   ├── Notes.css
│       │   │   │   └── Notes.js
│       │   │   ├── routes.js
│       │   │   └── services
│       │   │       └── NoteService.js
│       │   ├── prints
│       │   │   ├── components
│       │   │   │   ├── PrintAll.js
│       │   │   │   ├── PrintChart.js
│       │   │   │   ├── PrintCreateModal.js
│       │   │   │   ├── PrintEditModal.js
│       │   │   │   ├── PrinteEditLocationModal.js
│       │   │   │   ├── PrintLocation.js
│       │   │   │   ├── PrintModel.js
│       │   │   │   └── PrintModelCreateModal.js
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── Prints.css
│       │   │   │   └── Prints.js
│       │   │   └── services
│       │   │       └── PrintsService.js
│       │   └── staff
│       │       ├── index.js
│       │       ├── pages
│       │       │   ├── Staff.css
│       │       │   ├── Staff.js
│       │       │   ├── StaffCreateModal.js
│       │       │   ├── StaffEditModal.js
│       │       │   ├── StaffImportModal.js
│       │       │   ├── StaffSprav.js
│       │       │   ├── StaffSpravDepartments.js
│       │       │   └── style.module.css
│       │       ├── routes.js
│       │       ├── services
│       │       │   └── StaffService.js
│       │       └── store
│       │           └── UserStore.js
│       ├── Image
│       │   ├── 13506.750.jpg
│       │   ├── christmas-plains.png
│       │   ├── ib.jpg
│       │   ├── Landscaping-Logo.png
│       │   ├── plug1.jpg
│       │   ├── plug2.jpg
│       │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│       │   ├── UI.jpg
│       │   └── wordpress_web_security_header.jpg
│       ├── index.js
│       └── shared
│           └── PrivateRoute.js
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Components
│   │   │   ├── button
│   │   │   │   ├── buttonLogout.js
│   │   │   │   └── style.module.css
│   │   │   ├── circle
│   │   │   │   ├── Circle.js
│   │   │   │   └── Circle.module.css
│   │   │   ├── Clock.js
│   │   │   ├── NavBar
│   │   │   │   ├── NavBar.css
│   │   │   │   └── NavBar.js
│   │   │   └── Table
│   │   │       ├── style.module.css
│   │   │       └── Table.js
│   │   ├── features
│   │   │   ├── admin
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Admin.css
│   │   │   │   │   ├── Admin.js
│   │   │   │   │   ├── AdminCreate.js
│   │   │   │   │   ├── AdminEditUser.js
│   │   │   │   │   ├── LoginPage.js
│   │   │   │   │   ├── PrivateRoute.js
│   │   │   │   │   └── RoleSprav.js
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── AdminService.js
│   │   │   │   └── store
│   │   │   │       └── UserStore.js
│   │   │   ├── ib
│   │   │   │   ├── components
│   │   │   │   │   └── image
│   │   │   │   │       └── i.jpg
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ib.js
│   │   │   │   │   ├── instructions.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── ip
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ipaddress.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IpService.js
│   │   │   │   └── store
│   │   │   │       └── IpStore.js
│   │   │   ├── ius-pt
│   │   │   │   ├── components
│   │   │   │   │   ├── ButtonAll
│   │   │   │   │   │   ├── ButtonAll.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── IusAdm
│   │   │   │   │   │   └── IusAdm.js
│   │   │   │   │   ├── SearchInput
│   │   │   │   │   │   ├── SearchInput.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── SpravRole
│   │   │   │   │   │   ├── AddRoleModal.js
│   │   │   │   │   │   ├── SpravRole.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── StopRoles
│   │   │   │   │   │   ├── StopRoles.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── UserRoles
│   │   │   │   │   │   ├── AddOverRoleModal.js
│   │   │   │   │   │   ├── RoleGroup.js
│   │   │   │   │   │   ├── RoleRow.js
│   │   │   │   │   │   ├── RoleSelectionModal.js
│   │   │   │   │   │   ├── RoleSubGroup.js
│   │   │   │   │   │   ├── RoleTable.js
│   │   │   │   │   │   ├── RoleTableHeader.js
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRoles.js
│   │   │   │   │   ├── UserRolesPage
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRolesPage.js
│   │   │   │   │   └── UserTable
│   │   │   │   │       ├── EditUserModal.js
│   │   │   │   │       ├── style.module.css
│   │   │   │   │       └── UserTable.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── IusPt.js
│   │   │   │   │   ├── IusPtUser.js
│   │   │   │   │   ├── IusSprav.js
│   │   │   │   │   ├── IusUserApplication.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IusPtService.js
│   │   │   │   └── store
│   │   │   │       └── IusPtStore.js
│   │   │   ├── json
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── json.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── notes
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── CreatePost.js
│   │   │   │   │   ├── EditPost.js
│   │   │   │   │   ├── Notes.css
│   │   │   │   │   └── Notes.js
│   │   │   │   ├── routes.js
│   │   │   │   └── services
│   │   │   │       └── NoteService.js
│   │   │   ├── prints
│   │   │   │   ├── components
│   │   │   │   │   ├── PrintAll.js
│   │   │   │   │   ├── PrintChart.js
│   │   │   │   │   ├── PrintCreateModal.js
│   │   │   │   │   ├── PrintEditModal.js
│   │   │   │   │   ├── PrinteEditLocationModal.js
│   │   │   │   │   ├── PrintLocation.js
│   │   │   │   │   ├── PrintModel.js
│   │   │   │   │   └── PrintModelCreateModal.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Prints.css
│   │   │   │   │   └── Prints.js
│   │   │   │   └── services
│   │   │   │       └── PrintsService.js
│   │   │   └── staff
│   │   │       ├── index.js
│   │   │       ├── pages
│   │   │       │   ├── Staff.css
│   │   │       │   ├── Staff.js
│   │   │       │   ├── StaffCreateModal.js
│   │   │       │   ├── StaffEditModal.js
│   │   │       │   ├── StaffImportModal.js
│   │   │       │   ├── StaffSprav.js
│   │   │       │   ├── StaffSpravDepartments.js
│   │   │       │   └── style.module.css
│   │   │       ├── routes.js
│   │   │       ├── services
│   │   │       │   └── StaffService.js
│   │   │       └── store
│   │   │           └── UserStore.js
│   │   ├── Image
│   │   │   ├── 13506.750.jpg
│   │   │   ├── christmas-plains.png
│   │   │   ├── ib.jpg
│   │   │   ├── Landscaping-Logo.png
│   │   │   ├── plug1.jpg
│   │   │   ├── plug2.jpg
│   │   │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│   │   │   ├── UI.jpg
│   │   │   └── wordpress_web_security_header.jpg
│   │   ├── index.js
│   │   └── shared
│   │       └── PrivateRoute.js
│   └── tree.md
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Components
│   │   │   ├── button
│   │   │   │   ├── buttonLogout.js
│   │   │   │   └── style.module.css
│   │   │   ├── circle
│   │   │   │   ├── Circle.js
│   │   │   │   └── Circle.module.css
│   │   │   ├── Clock.js
│   │   │   ├── NavBar
│   │   │   │   ├── NavBar.css
│   │   │   │   └── NavBar.js
│   │   │   └── Table
│   │   │       ├── style.module.css
│   │   │       └── Table.js
│   │   ├── features
│   │   │   ├── admin
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Admin.css
│   │   │   │   │   ├── Admin.js
│   │   │   │   │   ├── AdminCreate.js
│   │   │   │   │   ├── AdminEditUser.js
│   │   │   │   │   ├── LoginPage.js
│   │   │   │   │   ├── PrivateRoute.js
│   │   │   │   │   └── RoleSprav.js
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── AdminService.js
│   │   │   │   └── store
│   │   │   │       └── UserStore.js
│   │   │   ├── ib
│   │   │   │   ├── components
│   │   │   │   │   └── image
│   │   │   │   │       └── i.jpg
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ib.js
│   │   │   │   │   ├── instructions.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── ip
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ipaddress.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IpService.js
│   │   │   │   └── store
│   │   │   │       └── IpStore.js
│   │   │   ├── ius-pt
│   │   │   │   ├── components
│   │   │   │   │   ├── ButtonAll
│   │   │   │   │   │   ├── ButtonAll.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── IusAdm
│   │   │   │   │   │   └── IusAdm.js
│   │   │   │   │   ├── SearchInput
│   │   │   │   │   │   ├── SearchInput.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── SpravRole
│   │   │   │   │   │   ├── AddRoleModal.js
│   │   │   │   │   │   ├── SpravRole.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── StopRoles
│   │   │   │   │   │   ├── StopRoles.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── UserRoles
│   │   │   │   │   │   ├── AddOverRoleModal.js
│   │   │   │   │   │   ├── RoleGroup.js
│   │   │   │   │   │   ├── RoleRow.js
│   │   │   │   │   │   ├── RoleSelectionModal.js
│   │   │   │   │   │   ├── RoleSubGroup.js
│   │   │   │   │   │   ├── RoleTable.js
│   │   │   │   │   │   ├── RoleTableHeader.js
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRoles.js
│   │   │   │   │   ├── UserRolesPage
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRolesPage.js
│   │   │   │   │   └── UserTable
│   │   │   │   │       ├── EditUserModal.js
│   │   │   │   │       ├── style.module.css
│   │   │   │   │       └── UserTable.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── IusPt.js
│   │   │   │   │   ├── IusPtUser.js
│   │   │   │   │   ├── IusSprav.js
│   │   │   │   │   ├── IusUserApplication.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IusPtService.js
│   │   │   │   └── store
│   │   │   │       └── IusPtStore.js
│   │   │   ├── json
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── json.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── notes
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── CreatePost.js
│   │   │   │   │   ├── EditPost.js
│   │   │   │   │   ├── Notes.css
│   │   │   │   │   └── Notes.js
│   │   │   │   ├── routes.js
│   │   │   │   └── services
│   │   │   │       └── NoteService.js
│   │   │   ├── prints
│   │   │   │   ├── components
│   │   │   │   │   ├── PrintAll.js
│   │   │   │   │   ├── PrintChart.js
│   │   │   │   │   ├── PrintCreateModal.js
│   │   │   │   │   ├── PrintEditModal.js
│   │   │   │   │   ├── PrinteEditLocationModal.js
│   │   │   │   │   ├── PrintLocation.js
│   │   │   │   │   ├── PrintModel.js
│   │   │   │   │   └── PrintModelCreateModal.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Prints.css
│   │   │   │   │   └── Prints.js
│   │   │   │   └── services
│   │   │   │       └── PrintsService.js
│   │   │   └── staff
│   │   │       ├── index.js
│   │   │       ├── pages
│   │   │       │   ├── Staff.css
│   │   │       │   ├── Staff.js
│   │   │       │   ├── StaffCreateModal.js
│   │   │       │   ├── StaffEditModal.js
│   │   │       │   ├── StaffImportModal.js
│   │   │       │   ├── StaffSprav.js
│   │   │       │   ├── StaffSpravDepartments.js
│   │   │       │   └── style.module.css
│   │   │       ├── routes.js
│   │   │       ├── services
│   │   │       │   └── StaffService.js
│   │   │       └── store
│   │   │           └── UserStore.js
│   │   ├── Image
│   │   │   ├── 13506.750.jpg
│   │   │   ├── christmas-plains.png
│   │   │   ├── ib.jpg
│   │   │   ├── Landscaping-Logo.png
│   │   │   ├── plug1.jpg
│   │   │   ├── plug2.jpg
│   │   │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│   │   │   ├── UI.jpg
│   │   │   └── wordpress_web_security_header.jpg
│   │   ├── index.js
│   │   └── shared
│   │       └── PrivateRoute.js
│   └── tree.md
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Components
│   │   │   ├── button
│   │   │   │   ├── buttonLogout.js
│   │   │   │   └── style.module.css
│   │   │   ├── circle
│   │   │   │   ├── Circle.js
│   │   │   │   └── Circle.module.css
│   │   │   ├── Clock.js
│   │   │   ├── NavBar
│   │   │   │   ├── NavBar.css
│   │   │   │   └── NavBar.js
│   │   │   └── Table
│   │   │       ├── style.module.css
│   │   │       └── Table.js
│   │   ├── features
│   │   │   ├── admin
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Admin.css
│   │   │   │   │   ├── Admin.js
│   │   │   │   │   ├── AdminCreate.js
│   │   │   │   │   ├── AdminEditUser.js
│   │   │   │   │   ├── LoginPage.js
│   │   │   │   │   ├── PrivateRoute.js
│   │   │   │   │   └── RoleSprav.js
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── AdminService.js
│   │   │   │   └── store
│   │   │   │       └── UserStore.js
│   │   │   ├── ib
│   │   │   │   ├── components
│   │   │   │   │   └── image
│   │   │   │   │       └── i.jpg
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ib.js
│   │   │   │   │   ├── instructions.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── ip
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ipaddress.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IpService.js
│   │   │   │   └── store
│   │   │   │       └── IpStore.js
│   │   │   ├── ius-pt
│   │   │   │   ├── components
│   │   │   │   │   ├── ButtonAll
│   │   │   │   │   │   ├── ButtonAll.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── IusAdm
│   │   │   │   │   │   └── IusAdm.js
│   │   │   │   │   ├── SearchInput
│   │   │   │   │   │   ├── SearchInput.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── SpravRole
│   │   │   │   │   │   ├── AddRoleModal.js
│   │   │   │   │   │   ├── SpravRole.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── StopRoles
│   │   │   │   │   │   ├── StopRoles.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── UserRoles
│   │   │   │   │   │   ├── AddOverRoleModal.js
│   │   │   │   │   │   ├── RoleGroup.js
│   │   │   │   │   │   ├── RoleRow.js
│   │   │   │   │   │   ├── RoleSelectionModal.js
│   │   │   │   │   │   ├── RoleSubGroup.js
│   │   │   │   │   │   ├── RoleTable.js
│   │   │   │   │   │   ├── RoleTableHeader.js
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRoles.js
│   │   │   │   │   ├── UserRolesPage
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRolesPage.js
│   │   │   │   │   └── UserTable
│   │   │   │   │       ├── EditUserModal.js
│   │   │   │   │       ├── style.module.css
│   │   │   │   │       └── UserTable.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── IusPt.js
│   │   │   │   │   ├── IusPtUser.js
│   │   │   │   │   ├── IusSprav.js
│   │   │   │   │   ├── IusUserApplication.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IusPtService.js
│   │   │   │   └── store
│   │   │   │       └── IusPtStore.js
│   │   │   ├── json
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── json.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── notes
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── CreatePost.js
│   │   │   │   │   ├── EditPost.js
│   │   │   │   │   ├── Notes.css
│   │   │   │   │   └── Notes.js
│   │   │   │   ├── routes.js
│   │   │   │   └── services
│   │   │   │       └── NoteService.js
│   │   │   ├── prints
│   │   │   │   ├── components
│   │   │   │   │   ├── PrintAll.js
│   │   │   │   │   ├── PrintChart.js
│   │   │   │   │   ├── PrintCreateModal.js
│   │   │   │   │   ├── PrintEditModal.js
│   │   │   │   │   ├── PrinteEditLocationModal.js
│   │   │   │   │   ├── PrintLocation.js
│   │   │   │   │   ├── PrintModel.js
│   │   │   │   │   └── PrintModelCreateModal.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Prints.css
│   │   │   │   │   └── Prints.js
│   │   │   │   └── services
│   │   │   │       └── PrintsService.js
│   │   │   └── staff
│   │   │       ├── index.js
│   │   │       ├── pages
│   │   │       │   ├── Staff.css
│   │   │       │   ├── Staff.js
│   │   │       │   ├── StaffCreateModal.js
│   │   │       │   ├── StaffEditModal.js
│   │   │       │   ├── StaffImportModal.js
│   │   │       │   ├── StaffSprav.js
│   │   │       │   ├── StaffSpravDepartments.js
│   │   │       │   └── style.module.css
│   │   │       ├── routes.js
│   │   │       ├── services
│   │   │       │   └── StaffService.js
│   │   │       └── store
│   │   │           └── UserStore.js
│   │   ├── Image
│   │   │   ├── 13506.750.jpg
│   │   │   ├── christmas-plains.png
│   │   │   ├── ib.jpg
│   │   │   ├── Landscaping-Logo.png
│   │   │   ├── plug1.jpg
│   │   │   ├── plug2.jpg
│   │   │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│   │   │   ├── UI.jpg
│   │   │   └── wordpress_web_security_header.jpg
│   │   ├── index.js
│   │   └── shared
│   │       └── PrivateRoute.js
│   └── tree.md
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Components
│   │   │   ├── button
│   │   │   │   ├── buttonLogout.js
│   │   │   │   └── style.module.css
│   │   │   ├── circle
│   │   │   │   ├── Circle.js
│   │   │   │   └── Circle.module.css
│   │   │   ├── Clock.js
│   │   │   ├── NavBar
│   │   │   │   ├── NavBar.css
│   │   │   │   └── NavBar.js
│   │   │   └── Table
│   │   │       ├── style.module.css
│   │   │       └── Table.js
│   │   ├── features
│   │   │   ├── admin
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Admin.css
│   │   │   │   │   ├── Admin.js
│   │   │   │   │   ├── AdminCreate.js
│   │   │   │   │   ├── AdminEditUser.js
│   │   │   │   │   ├── LoginPage.js
│   │   │   │   │   ├── PrivateRoute.js
│   │   │   │   │   └── RoleSprav.js
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── AdminService.js
│   │   │   │   └── store
│   │   │   │       └── UserStore.js
│   │   │   ├── ib
│   │   │   │   ├── components
│   │   │   │   │   └── image
│   │   │   │   │       └── i.jpg
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ib.js
│   │   │   │   │   ├── instructions.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── ip
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ipaddress.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IpService.js
│   │   │   │   └── store
│   │   │   │       └── IpStore.js
│   │   │   ├── ius-pt
│   │   │   │   ├── components
│   │   │   │   │   ├── ButtonAll
│   │   │   │   │   │   ├── ButtonAll.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── IusAdm
│   │   │   │   │   │   └── IusAdm.js
│   │   │   │   │   ├── SearchInput
│   │   │   │   │   │   ├── SearchInput.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── SpravRole
│   │   │   │   │   │   ├── AddRoleModal.js
│   │   │   │   │   │   ├── SpravRole.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── StopRoles
│   │   │   │   │   │   ├── StopRoles.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── UserRoles
│   │   │   │   │   │   ├── AddOverRoleModal.js
│   │   │   │   │   │   ├── RoleGroup.js
│   │   │   │   │   │   ├── RoleRow.js
│   │   │   │   │   │   ├── RoleSelectionModal.js
│   │   │   │   │   │   ├── RoleSubGroup.js
│   │   │   │   │   │   ├── RoleTable.js
│   │   │   │   │   │   ├── RoleTableHeader.js
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRoles.js
│   │   │   │   │   ├── UserRolesPage
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRolesPage.js
│   │   │   │   │   └── UserTable
│   │   │   │   │       ├── EditUserModal.js
│   │   │   │   │       ├── style.module.css
│   │   │   │   │       └── UserTable.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── IusPt.js
│   │   │   │   │   ├── IusPtUser.js
│   │   │   │   │   ├── IusSprav.js
│   │   │   │   │   ├── IusUserApplication.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IusPtService.js
│   │   │   │   └── store
│   │   │   │       └── IusPtStore.js
│   │   │   ├── json
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── json.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── notes
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── CreatePost.js
│   │   │   │   │   ├── EditPost.js
│   │   │   │   │   ├── Notes.css
│   │   │   │   │   └── Notes.js
│   │   │   │   ├── routes.js
│   │   │   │   └── services
│   │   │   │       └── NoteService.js
│   │   │   ├── prints
│   │   │   │   ├── components
│   │   │   │   │   ├── PrintAll.js
│   │   │   │   │   ├── PrintChart.js
│   │   │   │   │   ├── PrintCreateModal.js
│   │   │   │   │   ├── PrintEditModal.js
│   │   │   │   │   ├── PrinteEditLocationModal.js
│   │   │   │   │   ├── PrintLocation.js
│   │   │   │   │   ├── PrintModel.js
│   │   │   │   │   └── PrintModelCreateModal.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Prints.css
│   │   │   │   │   └── Prints.js
│   │   │   │   └── services
│   │   │   │       └── PrintsService.js
│   │   │   └── staff
│   │   │       ├── index.js
│   │   │       ├── pages
│   │   │       │   ├── Staff.css
│   │   │       │   ├── Staff.js
│   │   │       │   ├── StaffCreateModal.js
│   │   │       │   ├── StaffEditModal.js
│   │   │       │   ├── StaffImportModal.js
│   │   │       │   ├── StaffSprav.js
│   │   │       │   ├── StaffSpravDepartments.js
│   │   │       │   └── style.module.css
│   │   │       ├── routes.js
│   │   │       ├── services
│   │   │       │   └── StaffService.js
│   │   │       └── store
│   │   │           └── UserStore.js
│   │   ├── Image
│   │   │   ├── 13506.750.jpg
│   │   │   ├── christmas-plains.png
│   │   │   ├── ib.jpg
│   │   │   ├── Landscaping-Logo.png
│   │   │   ├── plug1.jpg
│   │   │   ├── plug2.jpg
│   │   │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│   │   │   ├── UI.jpg
│   │   │   └── wordpress_web_security_header.jpg
│   │   ├── index.js
│   │   └── shared
│   │       └── PrivateRoute.js
│   └── tree.md
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Components
│   │   │   ├── button
│   │   │   │   ├── buttonLogout.js
│   │   │   │   └── style.module.css
│   │   │   ├── circle
│   │   │   │   ├── Circle.js
│   │   │   │   └── Circle.module.css
│   │   │   ├── Clock.js
│   │   │   ├── NavBar
│   │   │   │   ├── NavBar.css
│   │   │   │   └── NavBar.js
│   │   │   └── Table
│   │   │       ├── style.module.css
│   │   │       └── Table.js
│   │   ├── features
│   │   │   ├── admin
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Admin.css
│   │   │   │   │   ├── Admin.js
│   │   │   │   │   ├── AdminCreate.js
│   │   │   │   │   ├── AdminEditUser.js
│   │   │   │   │   ├── LoginPage.js
│   │   │   │   │   ├── PrivateRoute.js
│   │   │   │   │   └── RoleSprav.js
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── AdminService.js
│   │   │   │   └── store
│   │   │   │       └── UserStore.js
│   │   │   ├── ib
│   │   │   │   ├── components
│   │   │   │   │   └── image
│   │   │   │   │       └── i.jpg
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ib.js
│   │   │   │   │   ├── instructions.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── ip
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ipaddress.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IpService.js
│   │   │   │   └── store
│   │   │   │       └── IpStore.js
│   │   │   ├── ius-pt
│   │   │   │   ├── components
│   │   │   │   │   ├── ButtonAll
│   │   │   │   │   │   ├── ButtonAll.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── IusAdm
│   │   │   │   │   │   └── IusAdm.js
│   │   │   │   │   ├── SearchInput
│   │   │   │   │   │   ├── SearchInput.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── SpravRole
│   │   │   │   │   │   ├── AddRoleModal.js
│   │   │   │   │   │   ├── SpravRole.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── StopRoles
│   │   │   │   │   │   ├── StopRoles.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── UserRoles
│   │   │   │   │   │   ├── AddOverRoleModal.js
│   │   │   │   │   │   ├── RoleGroup.js
│   │   │   │   │   │   ├── RoleRow.js
│   │   │   │   │   │   ├── RoleSelectionModal.js
│   │   │   │   │   │   ├── RoleSubGroup.js
│   │   │   │   │   │   ├── RoleTable.js
│   │   │   │   │   │   ├── RoleTableHeader.js
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRoles.js
│   │   │   │   │   ├── UserRolesPage
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRolesPage.js
│   │   │   │   │   └── UserTable
│   │   │   │   │       ├── EditUserModal.js
│   │   │   │   │       ├── style.module.css
│   │   │   │   │       └── UserTable.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── IusPt.js
│   │   │   │   │   ├── IusPtUser.js
│   │   │   │   │   ├── IusSprav.js
│   │   │   │   │   ├── IusUserApplication.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IusPtService.js
│   │   │   │   └── store
│   │   │   │       └── IusPtStore.js
│   │   │   ├── json
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── json.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── notes
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── CreatePost.js
│   │   │   │   │   ├── EditPost.js
│   │   │   │   │   ├── Notes.css
│   │   │   │   │   └── Notes.js
│   │   │   │   ├── routes.js
│   │   │   │   └── services
│   │   │   │       └── NoteService.js
│   │   │   ├── prints
│   │   │   │   ├── components
│   │   │   │   │   ├── PrintAll.js
│   │   │   │   │   ├── PrintChart.js
│   │   │   │   │   ├── PrintCreateModal.js
│   │   │   │   │   ├── PrintEditModal.js
│   │   │   │   │   ├── PrinteEditLocationModal.js
│   │   │   │   │   ├── PrintLocation.js
│   │   │   │   │   ├── PrintModel.js
│   │   │   │   │   └── PrintModelCreateModal.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Prints.css
│   │   │   │   │   └── Prints.js
│   │   │   │   └── services
│   │   │   │       └── PrintsService.js
│   │   │   └── staff
│   │   │       ├── index.js
│   │   │       ├── pages
│   │   │       │   ├── Staff.css
│   │   │       │   ├── Staff.js
│   │   │       │   ├── StaffCreateModal.js
│   │   │       │   ├── StaffEditModal.js
│   │   │       │   ├── StaffImportModal.js
│   │   │       │   ├── StaffSprav.js
│   │   │       │   ├── StaffSpravDepartments.js
│   │   │       │   └── style.module.css
│   │   │       ├── routes.js
│   │   │       ├── services
│   │   │       │   └── StaffService.js
│   │   │       └── store
│   │   │           └── UserStore.js
│   │   ├── Image
│   │   │   ├── 13506.750.jpg
│   │   │   ├── christmas-plains.png
│   │   │   ├── ib.jpg
│   │   │   ├── Landscaping-Logo.png
│   │   │   ├── plug1.jpg
│   │   │   ├── plug2.jpg
│   │   │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│   │   │   ├── UI.jpg
│   │   │   └── wordpress_web_security_header.jpg
│   │   ├── index.js
│   │   └── shared
│   │       └── PrivateRoute.js
│   └── tree.md
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Components
│   │   │   ├── button
│   │   │   │   ├── buttonLogout.js
│   │   │   │   └── style.module.css
│   │   │   ├── circle
│   │   │   │   ├── Circle.js
│   │   │   │   └── Circle.module.css
│   │   │   ├── Clock.js
│   │   │   ├── NavBar
│   │   │   │   ├── NavBar.css
│   │   │   │   └── NavBar.js
│   │   │   └── Table
│   │   │       ├── style.module.css
│   │   │       └── Table.js
│   │   ├── features
│   │   │   ├── admin
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Admin.css
│   │   │   │   │   ├── Admin.js
│   │   │   │   │   ├── AdminCreate.js
│   │   │   │   │   ├── AdminEditUser.js
│   │   │   │   │   ├── LoginPage.js
│   │   │   │   │   ├── PrivateRoute.js
│   │   │   │   │   └── RoleSprav.js
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── AdminService.js
│   │   │   │   └── store
│   │   │   │       └── UserStore.js
│   │   │   ├── ib
│   │   │   │   ├── components
│   │   │   │   │   └── image
│   │   │   │   │       └── i.jpg
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ib.js
│   │   │   │   │   ├── instructions.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── ip
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ipaddress.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IpService.js
│   │   │   │   └── store
│   │   │   │       └── IpStore.js
│   │   │   ├── ius-pt
│   │   │   │   ├── components
│   │   │   │   │   ├── ButtonAll
│   │   │   │   │   │   ├── ButtonAll.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── IusAdm
│   │   │   │   │   │   └── IusAdm.js
│   │   │   │   │   ├── SearchInput
│   │   │   │   │   │   ├── SearchInput.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── SpravRole
│   │   │   │   │   │   ├── AddRoleModal.js
│   │   │   │   │   │   ├── SpravRole.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── StopRoles
│   │   │   │   │   │   ├── StopRoles.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── UserRoles
│   │   │   │   │   │   ├── AddOverRoleModal.js
│   │   │   │   │   │   ├── RoleGroup.js
│   │   │   │   │   │   ├── RoleRow.js
│   │   │   │   │   │   ├── RoleSelectionModal.js
│   │   │   │   │   │   ├── RoleSubGroup.js
│   │   │   │   │   │   ├── RoleTable.js
│   │   │   │   │   │   ├── RoleTableHeader.js
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRoles.js
│   │   │   │   │   ├── UserRolesPage
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRolesPage.js
│   │   │   │   │   └── UserTable
│   │   │   │   │       ├── EditUserModal.js
│   │   │   │   │       ├── style.module.css
│   │   │   │   │       └── UserTable.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── IusPt.js
│   │   │   │   │   ├── IusPtUser.js
│   │   │   │   │   ├── IusSprav.js
│   │   │   │   │   ├── IusUserApplication.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IusPtService.js
│   │   │   │   └── store
│   │   │   │       └── IusPtStore.js
│   │   │   ├── json
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── json.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── notes
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── CreatePost.js
│   │   │   │   │   ├── EditPost.js
│   │   │   │   │   ├── Notes.css
│   │   │   │   │   └── Notes.js
│   │   │   │   ├── routes.js
│   │   │   │   └── services
│   │   │   │       └── NoteService.js
│   │   │   ├── prints
│   │   │   │   ├── components
│   │   │   │   │   ├── PrintAll.js
│   │   │   │   │   ├── PrintChart.js
│   │   │   │   │   ├── PrintCreateModal.js
│   │   │   │   │   ├── PrintEditModal.js
│   │   │   │   │   ├── PrinteEditLocationModal.js
│   │   │   │   │   ├── PrintLocation.js
│   │   │   │   │   ├── PrintModel.js
│   │   │   │   │   └── PrintModelCreateModal.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Prints.css
│   │   │   │   │   └── Prints.js
│   │   │   │   └── services
│   │   │   │       └── PrintsService.js
│   │   │   └── staff
│   │   │       ├── index.js
│   │   │       ├── pages
│   │   │       │   ├── Staff.css
│   │   │       │   ├── Staff.js
│   │   │       │   ├── StaffCreateModal.js
│   │   │       │   ├── StaffEditModal.js
│   │   │       │   ├── StaffImportModal.js
│   │   │       │   ├── StaffSprav.js
│   │   │       │   ├── StaffSpravDepartments.js
│   │   │       │   └── style.module.css
│   │   │       ├── routes.js
│   │   │       ├── services
│   │   │       │   └── StaffService.js
│   │   │       └── store
│   │   │           └── UserStore.js
│   │   ├── Image
│   │   │   ├── 13506.750.jpg
│   │   │   ├── christmas-plains.png
│   │   │   ├── ib.jpg
│   │   │   ├── Landscaping-Logo.png
│   │   │   ├── plug1.jpg
│   │   │   ├── plug2.jpg
│   │   │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│   │   │   ├── UI.jpg
│   │   │   └── wordpress_web_security_header.jpg
│   │   ├── index.js
│   │   └── shared
│   │       └── PrivateRoute.js
│   └── tree.md
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Components
│   │   │   ├── button
│   │   │   │   ├── buttonLogout.js
│   │   │   │   └── style.module.css
│   │   │   ├── circle
│   │   │   │   ├── Circle.js
│   │   │   │   └── Circle.module.css
│   │   │   ├── Clock.js
│   │   │   ├── NavBar
│   │   │   │   ├── NavBar.css
│   │   │   │   └── NavBar.js
│   │   │   └── Table
│   │   │       ├── style.module.css
│   │   │       └── Table.js
│   │   ├── features
│   │   │   ├── admin
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Admin.css
│   │   │   │   │   ├── Admin.js
│   │   │   │   │   ├── AdminCreate.js
│   │   │   │   │   ├── AdminEditUser.js
│   │   │   │   │   ├── LoginPage.js
│   │   │   │   │   ├── PrivateRoute.js
│   │   │   │   │   └── RoleSprav.js
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── AdminService.js
│   │   │   │   └── store
│   │   │   │       └── UserStore.js
│   │   │   ├── ib
│   │   │   │   ├── components
│   │   │   │   │   └── image
│   │   │   │   │       └── i.jpg
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ib.js
│   │   │   │   │   ├── instructions.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── ip
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ipaddress.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IpService.js
│   │   │   │   └── store
│   │   │   │       └── IpStore.js
│   │   │   ├── ius-pt
│   │   │   │   ├── components
│   │   │   │   │   ├── ButtonAll
│   │   │   │   │   │   ├── ButtonAll.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── IusAdm
│   │   │   │   │   │   └── IusAdm.js
│   │   │   │   │   ├── SearchInput
│   │   │   │   │   │   ├── SearchInput.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── SpravRole
│   │   │   │   │   │   ├── AddRoleModal.js
│   │   │   │   │   │   ├── SpravRole.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── StopRoles
│   │   │   │   │   │   ├── StopRoles.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── UserRoles
│   │   │   │   │   │   ├── AddOverRoleModal.js
│   │   │   │   │   │   ├── RoleGroup.js
│   │   │   │   │   │   ├── RoleRow.js
│   │   │   │   │   │   ├── RoleSelectionModal.js
│   │   │   │   │   │   ├── RoleSubGroup.js
│   │   │   │   │   │   ├── RoleTable.js
│   │   │   │   │   │   ├── RoleTableHeader.js
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRoles.js
│   │   │   │   │   ├── UserRolesPage
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRolesPage.js
│   │   │   │   │   └── UserTable
│   │   │   │   │       ├── EditUserModal.js
│   │   │   │   │       ├── style.module.css
│   │   │   │   │       └── UserTable.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── IusPt.js
│   │   │   │   │   ├── IusPtUser.js
│   │   │   │   │   ├── IusSprav.js
│   │   │   │   │   ├── IusUserApplication.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IusPtService.js
│   │   │   │   └── store
│   │   │   │       └── IusPtStore.js
│   │   │   ├── json
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── json.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── notes
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── CreatePost.js
│   │   │   │   │   ├── EditPost.js
│   │   │   │   │   ├── Notes.css
│   │   │   │   │   └── Notes.js
│   │   │   │   ├── routes.js
│   │   │   │   └── services
│   │   │   │       └── NoteService.js
│   │   │   ├── prints
│   │   │   │   ├── components
│   │   │   │   │   ├── PrintAll.js
│   │   │   │   │   ├── PrintChart.js
│   │   │   │   │   ├── PrintCreateModal.js
│   │   │   │   │   ├── PrintEditModal.js
│   │   │   │   │   ├── PrinteEditLocationModal.js
│   │   │   │   │   ├── PrintLocation.js
│   │   │   │   │   ├── PrintModel.js
│   │   │   │   │   └── PrintModelCreateModal.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Prints.css
│   │   │   │   │   └── Prints.js
│   │   │   │   └── services
│   │   │   │       └── PrintsService.js
│   │   │   └── staff
│   │   │       ├── index.js
│   │   │       ├── pages
│   │   │       │   ├── Staff.css
│   │   │       │   ├── Staff.js
│   │   │       │   ├── StaffCreateModal.js
│   │   │       │   ├── StaffEditModal.js
│   │   │       │   ├── StaffImportModal.js
│   │   │       │   ├── StaffSprav.js
│   │   │       │   ├── StaffSpravDepartments.js
│   │   │       │   └── style.module.css
│   │   │       ├── routes.js
│   │   │       ├── services
│   │   │       │   └── StaffService.js
│   │   │       └── store
│   │   │           └── UserStore.js
│   │   ├── Image
│   │   │   ├── 13506.750.jpg
│   │   │   ├── christmas-plains.png
│   │   │   ├── ib.jpg
│   │   │   ├── Landscaping-Logo.png
│   │   │   ├── plug1.jpg
│   │   │   ├── plug2.jpg
│   │   │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│   │   │   ├── UI.jpg
│   │   │   └── wordpress_web_security_header.jpg
│   │   ├── index.js
│   │   └── shared
│   │       └── PrivateRoute.js
│   └── tree.md
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Components
│   │   │   ├── button
│   │   │   │   ├── buttonLogout.js
│   │   │   │   └── style.module.css
│   │   │   ├── circle
│   │   │   │   ├── Circle.js
│   │   │   │   └── Circle.module.css
│   │   │   ├── Clock.js
│   │   │   ├── NavBar
│   │   │   │   ├── NavBar.css
│   │   │   │   └── NavBar.js
│   │   │   └── Table
│   │   │       ├── style.module.css
│   │   │       └── Table.js
│   │   ├── features
│   │   │   ├── admin
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Admin.css
│   │   │   │   │   ├── Admin.js
│   │   │   │   │   ├── AdminCreate.js
│   │   │   │   │   ├── AdminEditUser.js
│   │   │   │   │   ├── LoginPage.js
│   │   │   │   │   ├── PrivateRoute.js
│   │   │   │   │   └── RoleSprav.js
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── AdminService.js
│   │   │   │   └── store
│   │   │   │       └── UserStore.js
│   │   │   ├── ib
│   │   │   │   ├── components
│   │   │   │   │   └── image
│   │   │   │   │       └── i.jpg
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ib.js
│   │   │   │   │   ├── instructions.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── ip
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ipaddress.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IpService.js
│   │   │   │   └── store
│   │   │   │       └── IpStore.js
│   │   │   ├── ius-pt
│   │   │   │   ├── components
│   │   │   │   │   ├── ButtonAll
│   │   │   │   │   │   ├── ButtonAll.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── IusAdm
│   │   │   │   │   │   └── IusAdm.js
│   │   │   │   │   ├── SearchInput
│   │   │   │   │   │   ├── SearchInput.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── SpravRole
│   │   │   │   │   │   ├── AddRoleModal.js
│   │   │   │   │   │   ├── SpravRole.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── StopRoles
│   │   │   │   │   │   ├── StopRoles.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── UserRoles
│   │   │   │   │   │   ├── AddOverRoleModal.js
│   │   │   │   │   │   ├── RoleGroup.js
│   │   │   │   │   │   ├── RoleRow.js
│   │   │   │   │   │   ├── RoleSelectionModal.js
│   │   │   │   │   │   ├── RoleSubGroup.js
│   │   │   │   │   │   ├── RoleTable.js
│   │   │   │   │   │   ├── RoleTableHeader.js
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRoles.js
│   │   │   │   │   ├── UserRolesPage
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRolesPage.js
│   │   │   │   │   └── UserTable
│   │   │   │   │       ├── EditUserModal.js
│   │   │   │   │       ├── style.module.css
│   │   │   │   │       └── UserTable.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── IusPt.js
│   │   │   │   │   ├── IusPtUser.js
│   │   │   │   │   ├── IusSprav.js
│   │   │   │   │   ├── IusUserApplication.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IusPtService.js
│   │   │   │   └── store
│   │   │   │       └── IusPtStore.js
│   │   │   ├── json
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── json.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── notes
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── CreatePost.js
│   │   │   │   │   ├── EditPost.js
│   │   │   │   │   ├── Notes.css
│   │   │   │   │   └── Notes.js
│   │   │   │   ├── routes.js
│   │   │   │   └── services
│   │   │   │       └── NoteService.js
│   │   │   ├── prints
│   │   │   │   ├── components
│   │   │   │   │   ├── PrintAll.js
│   │   │   │   │   ├── PrintChart.js
│   │   │   │   │   ├── PrintCreateModal.js
│   │   │   │   │   ├── PrintEditModal.js
│   │   │   │   │   ├── PrinteEditLocationModal.js
│   │   │   │   │   ├── PrintLocation.js
│   │   │   │   │   ├── PrintModel.js
│   │   │   │   │   └── PrintModelCreateModal.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Prints.css
│   │   │   │   │   └── Prints.js
│   │   │   │   └── services
│   │   │   │       └── PrintsService.js
│   │   │   └── staff
│   │   │       ├── index.js
│   │   │       ├── pages
│   │   │       │   ├── Staff.css
│   │   │       │   ├── Staff.js
│   │   │       │   ├── StaffCreateModal.js
│   │   │       │   ├── StaffEditModal.js
│   │   │       │   ├── StaffImportModal.js
│   │   │       │   ├── StaffSprav.js
│   │   │       │   ├── StaffSpravDepartments.js
│   │   │       │   └── style.module.css
│   │   │       ├── routes.js
│   │   │       ├── services
│   │   │       │   └── StaffService.js
│   │   │       └── store
│   │   │           └── UserStore.js
│   │   ├── Image
│   │   │   ├── 13506.750.jpg
│   │   │   ├── christmas-plains.png
│   │   │   ├── ib.jpg
│   │   │   ├── Landscaping-Logo.png
│   │   │   ├── plug1.jpg
│   │   │   ├── plug2.jpg
│   │   │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│   │   │   ├── UI.jpg
│   │   │   └── wordpress_web_security_header.jpg
│   │   ├── index.js
│   │   └── shared
│   │       └── PrivateRoute.js
│   └── tree.md
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Components
│   │   │   ├── button
│   │   │   │   ├── buttonLogout.js
│   │   │   │   └── style.module.css
│   │   │   ├── circle
│   │   │   │   ├── Circle.js
│   │   │   │   └── Circle.module.css
│   │   │   ├── Clock.js
│   │   │   ├── NavBar
│   │   │   │   ├── NavBar.css
│   │   │   │   └── NavBar.js
│   │   │   └── Table
│   │   │       ├── style.module.css
│   │   │       └── Table.js
│   │   ├── features
│   │   │   ├── admin
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Admin.css
│   │   │   │   │   ├── Admin.js
│   │   │   │   │   ├── AdminCreate.js
│   │   │   │   │   ├── AdminEditUser.js
│   │   │   │   │   ├── LoginPage.js
│   │   │   │   │   ├── PrivateRoute.js
│   │   │   │   │   └── RoleSprav.js
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── AdminService.js
│   │   │   │   └── store
│   │   │   │       └── UserStore.js
│   │   │   ├── ib
│   │   │   │   ├── components
│   │   │   │   │   └── image
│   │   │   │   │       └── i.jpg
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ib.js
│   │   │   │   │   ├── instructions.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── ip
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ipaddress.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IpService.js
│   │   │   │   └── store
│   │   │   │       └── IpStore.js
│   │   │   ├── ius-pt
│   │   │   │   ├── components
│   │   │   │   │   ├── ButtonAll
│   │   │   │   │   │   ├── ButtonAll.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── IusAdm
│   │   │   │   │   │   └── IusAdm.js
│   │   │   │   │   ├── SearchInput
│   │   │   │   │   │   ├── SearchInput.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── SpravRole
│   │   │   │   │   │   ├── AddRoleModal.js
│   │   │   │   │   │   ├── SpravRole.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── StopRoles
│   │   │   │   │   │   ├── StopRoles.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── UserRoles
│   │   │   │   │   │   ├── AddOverRoleModal.js
│   │   │   │   │   │   ├── RoleGroup.js
│   │   │   │   │   │   ├── RoleRow.js
│   │   │   │   │   │   ├── RoleSelectionModal.js
│   │   │   │   │   │   ├── RoleSubGroup.js
│   │   │   │   │   │   ├── RoleTable.js
│   │   │   │   │   │   ├── RoleTableHeader.js
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRoles.js
│   │   │   │   │   ├── UserRolesPage
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRolesPage.js
│   │   │   │   │   └── UserTable
│   │   │   │   │       ├── EditUserModal.js
│   │   │   │   │       ├── style.module.css
│   │   │   │   │       └── UserTable.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── IusPt.js
│   │   │   │   │   ├── IusPtUser.js
│   │   │   │   │   ├── IusSprav.js
│   │   │   │   │   ├── IusUserApplication.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IusPtService.js
│   │   │   │   └── store
│   │   │   │       └── IusPtStore.js
│   │   │   ├── json
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── json.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── notes
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── CreatePost.js
│   │   │   │   │   ├── EditPost.js
│   │   │   │   │   ├── Notes.css
│   │   │   │   │   └── Notes.js
│   │   │   │   ├── routes.js
│   │   │   │   └── services
│   │   │   │       └── NoteService.js
│   │   │   ├── prints
│   │   │   │   ├── components
│   │   │   │   │   ├── PrintAll.js
│   │   │   │   │   ├── PrintChart.js
│   │   │   │   │   ├── PrintCreateModal.js
│   │   │   │   │   ├── PrintEditModal.js
│   │   │   │   │   ├── PrinteEditLocationModal.js
│   │   │   │   │   ├── PrintLocation.js
│   │   │   │   │   ├── PrintModel.js
│   │   │   │   │   └── PrintModelCreateModal.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Prints.css
│   │   │   │   │   └── Prints.js
│   │   │   │   └── services
│   │   │   │       └── PrintsService.js
│   │   │   └── staff
│   │   │       ├── index.js
│   │   │       ├── pages
│   │   │       │   ├── Staff.css
│   │   │       │   ├── Staff.js
│   │   │       │   ├── StaffCreateModal.js
│   │   │       │   ├── StaffEditModal.js
│   │   │       │   ├── StaffImportModal.js
│   │   │       │   ├── StaffSprav.js
│   │   │       │   ├── StaffSpravDepartments.js
│   │   │       │   └── style.module.css
│   │   │       ├── routes.js
│   │   │       ├── services
│   │   │       │   └── StaffService.js
│   │   │       └── store
│   │   │           └── UserStore.js
│   │   ├── Image
│   │   │   ├── 13506.750.jpg
│   │   │   ├── christmas-plains.png
│   │   │   ├── ib.jpg
│   │   │   ├── Landscaping-Logo.png
│   │   │   ├── plug1.jpg
│   │   │   ├── plug2.jpg
│   │   │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│   │   │   ├── UI.jpg
│   │   │   └── wordpress_web_security_header.jpg
│   │   ├── index.js
│   │   └── shared
│   │       └── PrivateRoute.js
│   └── tree.md
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Components
│   │   │   ├── button
│   │   │   │   ├── buttonLogout.js
│   │   │   │   └── style.module.css
│   │   │   ├── circle
│   │   │   │   ├── Circle.js
│   │   │   │   └── Circle.module.css
│   │   │   ├── Clock.js
│   │   │   ├── NavBar
│   │   │   │   ├── NavBar.css
│   │   │   │   └── NavBar.js
│   │   │   └── Table
│   │   │       ├── style.module.css
│   │   │       └── Table.js
│   │   ├── features
│   │   │   ├── admin
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Admin.css
│   │   │   │   │   ├── Admin.js
│   │   │   │   │   ├── AdminCreate.js
│   │   │   │   │   ├── AdminEditUser.js
│   │   │   │   │   ├── LoginPage.js
│   │   │   │   │   ├── PrivateRoute.js
│   │   │   │   │   └── RoleSprav.js
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── AdminService.js
│   │   │   │   └── store
│   │   │   │       └── UserStore.js
│   │   │   ├── ib
│   │   │   │   ├── components
│   │   │   │   │   └── image
│   │   │   │   │       └── i.jpg
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ib.js
│   │   │   │   │   ├── instructions.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── ip
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ipaddress.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IpService.js
│   │   │   │   └── store
│   │   │   │       └── IpStore.js
│   │   │   ├── ius-pt
│   │   │   │   ├── components
│   │   │   │   │   ├── ButtonAll
│   │   │   │   │   │   ├── ButtonAll.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── IusAdm
│   │   │   │   │   │   └── IusAdm.js
│   │   │   │   │   ├── SearchInput
│   │   │   │   │   │   ├── SearchInput.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── SpravRole
│   │   │   │   │   │   ├── AddRoleModal.js
│   │   │   │   │   │   ├── SpravRole.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── StopRoles
│   │   │   │   │   │   ├── StopRoles.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── UserRoles
│   │   │   │   │   │   ├── AddOverRoleModal.js
│   │   │   │   │   │   ├── RoleGroup.js
│   │   │   │   │   │   ├── RoleRow.js
│   │   │   │   │   │   ├── RoleSelectionModal.js
│   │   │   │   │   │   ├── RoleSubGroup.js
│   │   │   │   │   │   ├── RoleTable.js
│   │   │   │   │   │   ├── RoleTableHeader.js
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRoles.js
│   │   │   │   │   ├── UserRolesPage
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRolesPage.js
│   │   │   │   │   └── UserTable
│   │   │   │   │       ├── EditUserModal.js
│   │   │   │   │       ├── style.module.css
│   │   │   │   │       └── UserTable.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── IusPt.js
│   │   │   │   │   ├── IusPtUser.js
│   │   │   │   │   ├── IusSprav.js
│   │   │   │   │   ├── IusUserApplication.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IusPtService.js
│   │   │   │   └── store
│   │   │   │       └── IusPtStore.js
│   │   │   ├── json
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── json.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── notes
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── CreatePost.js
│   │   │   │   │   ├── EditPost.js
│   │   │   │   │   ├── Notes.css
│   │   │   │   │   └── Notes.js
│   │   │   │   ├── routes.js
│   │   │   │   └── services
│   │   │   │       └── NoteService.js
│   │   │   ├── prints
│   │   │   │   ├── components
│   │   │   │   │   ├── PrintAll.js
│   │   │   │   │   ├── PrintChart.js
│   │   │   │   │   ├── PrintCreateModal.js
│   │   │   │   │   ├── PrintEditModal.js
│   │   │   │   │   ├── PrinteEditLocationModal.js
│   │   │   │   │   ├── PrintLocation.js
│   │   │   │   │   ├── PrintModel.js
│   │   │   │   │   └── PrintModelCreateModal.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Prints.css
│   │   │   │   │   └── Prints.js
│   │   │   │   └── services
│   │   │   │       └── PrintsService.js
│   │   │   └── staff
│   │   │       ├── index.js
│   │   │       ├── pages
│   │   │       │   ├── Staff.css
│   │   │       │   ├── Staff.js
│   │   │       │   ├── StaffCreateModal.js
│   │   │       │   ├── StaffEditModal.js
│   │   │       │   ├── StaffImportModal.js
│   │   │       │   ├── StaffSprav.js
│   │   │       │   ├── StaffSpravDepartments.js
│   │   │       │   └── style.module.css
│   │   │       ├── routes.js
│   │   │       ├── services
│   │   │       │   └── StaffService.js
│   │   │       └── store
│   │   │           └── UserStore.js
│   │   ├── Image
│   │   │   ├── 13506.750.jpg
│   │   │   ├── christmas-plains.png
│   │   │   ├── ib.jpg
│   │   │   ├── Landscaping-Logo.png
│   │   │   ├── plug1.jpg
│   │   │   ├── plug2.jpg
│   │   │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│   │   │   ├── UI.jpg
│   │   │   └── wordpress_web_security_header.jpg
│   │   ├── index.js
│   │   └── shared
│   │       └── PrivateRoute.js
│   └── tree.md
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Components
│   │   │   ├── button
│   │   │   │   ├── buttonLogout.js
│   │   │   │   └── style.module.css
│   │   │   ├── circle
│   │   │   │   ├── Circle.js
│   │   │   │   └── Circle.module.css
│   │   │   ├── Clock.js
│   │   │   ├── NavBar
│   │   │   │   ├── NavBar.css
│   │   │   │   └── NavBar.js
│   │   │   └── Table
│   │   │       ├── style.module.css
│   │   │       └── Table.js
│   │   ├── features
│   │   │   ├── admin
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Admin.css
│   │   │   │   │   ├── Admin.js
│   │   │   │   │   ├── AdminCreate.js
│   │   │   │   │   ├── AdminEditUser.js
│   │   │   │   │   ├── LoginPage.js
│   │   │   │   │   ├── PrivateRoute.js
│   │   │   │   │   └── RoleSprav.js
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── AdminService.js
│   │   │   │   └── store
│   │   │   │       └── UserStore.js
│   │   │   ├── ib
│   │   │   │   ├── components
│   │   │   │   │   └── image
│   │   │   │   │       └── i.jpg
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ib.js
│   │   │   │   │   ├── instructions.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── ip
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ipaddress.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IpService.js
│   │   │   │   └── store
│   │   │   │       └── IpStore.js
│   │   │   ├── ius-pt
│   │   │   │   ├── components
│   │   │   │   │   ├── ButtonAll
│   │   │   │   │   │   ├── ButtonAll.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── IusAdm
│   │   │   │   │   │   └── IusAdm.js
│   │   │   │   │   ├── SearchInput
│   │   │   │   │   │   ├── SearchInput.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── SpravRole
│   │   │   │   │   │   ├── AddRoleModal.js
│   │   │   │   │   │   ├── SpravRole.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── StopRoles
│   │   │   │   │   │   ├── StopRoles.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── UserRoles
│   │   │   │   │   │   ├── AddOverRoleModal.js
│   │   │   │   │   │   ├── RoleGroup.js
│   │   │   │   │   │   ├── RoleRow.js
│   │   │   │   │   │   ├── RoleSelectionModal.js
│   │   │   │   │   │   ├── RoleSubGroup.js
│   │   │   │   │   │   ├── RoleTable.js
│   │   │   │   │   │   ├── RoleTableHeader.js
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRoles.js
│   │   │   │   │   ├── UserRolesPage
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRolesPage.js
│   │   │   │   │   └── UserTable
│   │   │   │   │       ├── EditUserModal.js
│   │   │   │   │       ├── style.module.css
│   │   │   │   │       └── UserTable.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── IusPt.js
│   │   │   │   │   ├── IusPtUser.js
│   │   │   │   │   ├── IusSprav.js
│   │   │   │   │   ├── IusUserApplication.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IusPtService.js
│   │   │   │   └── store
│   │   │   │       └── IusPtStore.js
│   │   │   ├── json
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── json.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── notes
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── CreatePost.js
│   │   │   │   │   ├── EditPost.js
│   │   │   │   │   ├── Notes.css
│   │   │   │   │   └── Notes.js
│   │   │   │   ├── routes.js
│   │   │   │   └── services
│   │   │   │       └── NoteService.js
│   │   │   ├── prints
│   │   │   │   ├── components
│   │   │   │   │   ├── PrintAll.js
│   │   │   │   │   ├── PrintChart.js
│   │   │   │   │   ├── PrintCreateModal.js
│   │   │   │   │   ├── PrintEditModal.js
│   │   │   │   │   ├── PrinteEditLocationModal.js
│   │   │   │   │   ├── PrintLocation.js
│   │   │   │   │   ├── PrintModel.js
│   │   │   │   │   └── PrintModelCreateModal.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Prints.css
│   │   │   │   │   └── Prints.js
│   │   │   │   └── services
│   │   │   │       └── PrintsService.js
│   │   │   └── staff
│   │   │       ├── index.js
│   │   │       ├── pages
│   │   │       │   ├── Staff.css
│   │   │       │   ├── Staff.js
│   │   │       │   ├── StaffCreateModal.js
│   │   │       │   ├── StaffEditModal.js
│   │   │       │   ├── StaffImportModal.js
│   │   │       │   ├── StaffSprav.js
│   │   │       │   ├── StaffSpravDepartments.js
│   │   │       │   └── style.module.css
│   │   │       ├── routes.js
│   │   │       ├── services
│   │   │       │   └── StaffService.js
│   │   │       └── store
│   │   │           └── UserStore.js
│   │   ├── Image
│   │   │   ├── 13506.750.jpg
│   │   │   ├── christmas-plains.png
│   │   │   ├── ib.jpg
│   │   │   ├── Landscaping-Logo.png
│   │   │   ├── plug1.jpg
│   │   │   ├── plug2.jpg
│   │   │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│   │   │   ├── UI.jpg
│   │   │   └── wordpress_web_security_header.jpg
│   │   ├── index.js
│   │   └── shared
│   │       └── PrivateRoute.js
│   └── tree.md
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Components
│   │   │   ├── button
│   │   │   │   ├── buttonLogout.js
│   │   │   │   └── style.module.css
│   │   │   ├── circle
│   │   │   │   ├── Circle.js
│   │   │   │   └── Circle.module.css
│   │   │   ├── Clock.js
│   │   │   ├── NavBar
│   │   │   │   ├── NavBar.css
│   │   │   │   └── NavBar.js
│   │   │   └── Table
│   │   │       ├── style.module.css
│   │   │       └── Table.js
│   │   ├── features
│   │   │   ├── admin
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Admin.css
│   │   │   │   │   ├── Admin.js
│   │   │   │   │   ├── AdminCreate.js
│   │   │   │   │   ├── AdminEditUser.js
│   │   │   │   │   ├── LoginPage.js
│   │   │   │   │   ├── PrivateRoute.js
│   │   │   │   │   └── RoleSprav.js
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── AdminService.js
│   │   │   │   └── store
│   │   │   │       └── UserStore.js
│   │   │   ├── ib
│   │   │   │   ├── components
│   │   │   │   │   └── image
│   │   │   │   │       └── i.jpg
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ib.js
│   │   │   │   │   ├── instructions.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── ip
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ipaddress.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IpService.js
│   │   │   │   └── store
│   │   │   │       └── IpStore.js
│   │   │   ├── ius-pt
│   │   │   │   ├── components
│   │   │   │   │   ├── ButtonAll
│   │   │   │   │   │   ├── ButtonAll.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── IusAdm
│   │   │   │   │   │   └── IusAdm.js
│   │   │   │   │   ├── SearchInput
│   │   │   │   │   │   ├── SearchInput.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── SpravRole
│   │   │   │   │   │   ├── AddRoleModal.js
│   │   │   │   │   │   ├── SpravRole.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── StopRoles
│   │   │   │   │   │   ├── StopRoles.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── UserRoles
│   │   │   │   │   │   ├── AddOverRoleModal.js
│   │   │   │   │   │   ├── RoleGroup.js
│   │   │   │   │   │   ├── RoleRow.js
│   │   │   │   │   │   ├── RoleSelectionModal.js
│   │   │   │   │   │   ├── RoleSubGroup.js
│   │   │   │   │   │   ├── RoleTable.js
│   │   │   │   │   │   ├── RoleTableHeader.js
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRoles.js
│   │   │   │   │   ├── UserRolesPage
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRolesPage.js
│   │   │   │   │   └── UserTable
│   │   │   │   │       ├── EditUserModal.js
│   │   │   │   │       ├── style.module.css
│   │   │   │   │       └── UserTable.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── IusPt.js
│   │   │   │   │   ├── IusPtUser.js
│   │   │   │   │   ├── IusSprav.js
│   │   │   │   │   ├── IusUserApplication.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IusPtService.js
│   │   │   │   └── store
│   │   │   │       └── IusPtStore.js
│   │   │   ├── json
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── json.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── notes
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── CreatePost.js
│   │   │   │   │   ├── EditPost.js
│   │   │   │   │   ├── Notes.css
│   │   │   │   │   └── Notes.js
│   │   │   │   ├── routes.js
│   │   │   │   └── services
│   │   │   │       └── NoteService.js
│   │   │   ├── prints
│   │   │   │   ├── components
│   │   │   │   │   ├── PrintAll.js
│   │   │   │   │   ├── PrintChart.js
│   │   │   │   │   ├── PrintCreateModal.js
│   │   │   │   │   ├── PrintEditModal.js
│   │   │   │   │   ├── PrinteEditLocationModal.js
│   │   │   │   │   ├── PrintLocation.js
│   │   │   │   │   ├── PrintModel.js
│   │   │   │   │   └── PrintModelCreateModal.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Prints.css
│   │   │   │   │   └── Prints.js
│   │   │   │   └── services
│   │   │   │       └── PrintsService.js
│   │   │   └── staff
│   │   │       ├── index.js
│   │   │       ├── pages
│   │   │       │   ├── Staff.css
│   │   │       │   ├── Staff.js
│   │   │       │   ├── StaffCreateModal.js
│   │   │       │   ├── StaffEditModal.js
│   │   │       │   ├── StaffImportModal.js
│   │   │       │   ├── StaffSprav.js
│   │   │       │   ├── StaffSpravDepartments.js
│   │   │       │   └── style.module.css
│   │   │       ├── routes.js
│   │   │       ├── services
│   │   │       │   └── StaffService.js
│   │   │       └── store
│   │   │           └── UserStore.js
│   │   ├── Image
│   │   │   ├── 13506.750.jpg
│   │   │   ├── christmas-plains.png
│   │   │   ├── ib.jpg
│   │   │   ├── Landscaping-Logo.png
│   │   │   ├── plug1.jpg
│   │   │   ├── plug2.jpg
│   │   │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│   │   │   ├── UI.jpg
│   │   │   └── wordpress_web_security_header.jpg
│   │   ├── index.js
│   │   └── shared
│   │       └── PrivateRoute.js
│   └── tree.md
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Components
│   │   │   ├── button
│   │   │   │   ├── buttonLogout.js
│   │   │   │   └── style.module.css
│   │   │   ├── circle
│   │   │   │   ├── Circle.js
│   │   │   │   └── Circle.module.css
│   │   │   ├── Clock.js
│   │   │   ├── NavBar
│   │   │   │   ├── NavBar.css
│   │   │   │   └── NavBar.js
│   │   │   └── Table
│   │   │       ├── style.module.css
│   │   │       └── Table.js
│   │   ├── features
│   │   │   ├── admin
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Admin.css
│   │   │   │   │   ├── Admin.js
│   │   │   │   │   ├── AdminCreate.js
│   │   │   │   │   ├── AdminEditUser.js
│   │   │   │   │   ├── LoginPage.js
│   │   │   │   │   ├── PrivateRoute.js
│   │   │   │   │   └── RoleSprav.js
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── AdminService.js
│   │   │   │   └── store
│   │   │   │       └── UserStore.js
│   │   │   ├── ib
│   │   │   │   ├── components
│   │   │   │   │   └── image
│   │   │   │   │       └── i.jpg
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ib.js
│   │   │   │   │   ├── instructions.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── ip
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ipaddress.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IpService.js
│   │   │   │   └── store
│   │   │   │       └── IpStore.js
│   │   │   ├── ius-pt
│   │   │   │   ├── components
│   │   │   │   │   ├── ButtonAll
│   │   │   │   │   │   ├── ButtonAll.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── IusAdm
│   │   │   │   │   │   └── IusAdm.js
│   │   │   │   │   ├── SearchInput
│   │   │   │   │   │   ├── SearchInput.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── SpravRole
│   │   │   │   │   │   ├── AddRoleModal.js
│   │   │   │   │   │   ├── SpravRole.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── StopRoles
│   │   │   │   │   │   ├── StopRoles.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── UserRoles
│   │   │   │   │   │   ├── AddOverRoleModal.js
│   │   │   │   │   │   ├── RoleGroup.js
│   │   │   │   │   │   ├── RoleRow.js
│   │   │   │   │   │   ├── RoleSelectionModal.js
│   │   │   │   │   │   ├── RoleSubGroup.js
│   │   │   │   │   │   ├── RoleTable.js
│   │   │   │   │   │   ├── RoleTableHeader.js
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRoles.js
│   │   │   │   │   ├── UserRolesPage
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRolesPage.js
│   │   │   │   │   └── UserTable
│   │   │   │   │       ├── EditUserModal.js
│   │   │   │   │       ├── style.module.css
│   │   │   │   │       └── UserTable.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── IusPt.js
│   │   │   │   │   ├── IusPtUser.js
│   │   │   │   │   ├── IusSprav.js
│   │   │   │   │   ├── IusUserApplication.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IusPtService.js
│   │   │   │   └── store
│   │   │   │       └── IusPtStore.js
│   │   │   ├── json
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── json.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── notes
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── CreatePost.js
│   │   │   │   │   ├── EditPost.js
│   │   │   │   │   ├── Notes.css
│   │   │   │   │   └── Notes.js
│   │   │   │   ├── routes.js
│   │   │   │   └── services
│   │   │   │       └── NoteService.js
│   │   │   ├── prints
│   │   │   │   ├── components
│   │   │   │   │   ├── PrintAll.js
│   │   │   │   │   ├── PrintChart.js
│   │   │   │   │   ├── PrintCreateModal.js
│   │   │   │   │   ├── PrintEditModal.js
│   │   │   │   │   ├── PrinteEditLocationModal.js
│   │   │   │   │   ├── PrintLocation.js
│   │   │   │   │   ├── PrintModel.js
│   │   │   │   │   └── PrintModelCreateModal.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Prints.css
│   │   │   │   │   └── Prints.js
│   │   │   │   └── services
│   │   │   │       └── PrintsService.js
│   │   │   └── staff
│   │   │       ├── index.js
│   │   │       ├── pages
│   │   │       │   ├── Staff.css
│   │   │       │   ├── Staff.js
│   │   │       │   ├── StaffCreateModal.js
│   │   │       │   ├── StaffEditModal.js
│   │   │       │   ├── StaffImportModal.js
│   │   │       │   ├── StaffSprav.js
│   │   │       │   ├── StaffSpravDepartments.js
│   │   │       │   └── style.module.css
│   │   │       ├── routes.js
│   │   │       ├── services
│   │   │       │   └── StaffService.js
│   │   │       └── store
│   │   │           └── UserStore.js
│   │   ├── Image
│   │   │   ├── 13506.750.jpg
│   │   │   ├── christmas-plains.png
│   │   │   ├── ib.jpg
│   │   │   ├── Landscaping-Logo.png
│   │   │   ├── plug1.jpg
│   │   │   ├── plug2.jpg
│   │   │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│   │   │   ├── UI.jpg
│   │   │   └── wordpress_web_security_header.jpg
│   │   ├── index.js
│   │   └── shared
│   │       └── PrivateRoute.js
│   └── tree.md
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Components
│   │   │   ├── button
│   │   │   │   ├── buttonLogout.js
│   │   │   │   └── style.module.css
│   │   │   ├── circle
│   │   │   │   ├── Circle.js
│   │   │   │   └── Circle.module.css
│   │   │   ├── Clock.js
│   │   │   ├── NavBar
│   │   │   │   ├── NavBar.css
│   │   │   │   └── NavBar.js
│   │   │   └── Table
│   │   │       ├── style.module.css
│   │   │       └── Table.js
│   │   ├── features
│   │   │   ├── admin
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Admin.css
│   │   │   │   │   ├── Admin.js
│   │   │   │   │   ├── AdminCreate.js
│   │   │   │   │   ├── AdminEditUser.js
│   │   │   │   │   ├── LoginPage.js
│   │   │   │   │   ├── PrivateRoute.js
│   │   │   │   │   └── RoleSprav.js
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── AdminService.js
│   │   │   │   └── store
│   │   │   │       └── UserStore.js
│   │   │   ├── ib
│   │   │   │   ├── components
│   │   │   │   │   └── image
│   │   │   │   │       └── i.jpg
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ib.js
│   │   │   │   │   ├── instructions.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── ip
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ipaddress.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IpService.js
│   │   │   │   └── store
│   │   │   │       └── IpStore.js
│   │   │   ├── ius-pt
│   │   │   │   ├── components
│   │   │   │   │   ├── ButtonAll
│   │   │   │   │   │   ├── ButtonAll.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── IusAdm
│   │   │   │   │   │   └── IusAdm.js
│   │   │   │   │   ├── SearchInput
│   │   │   │   │   │   ├── SearchInput.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── SpravRole
│   │   │   │   │   │   ├── AddRoleModal.js
│   │   │   │   │   │   ├── SpravRole.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── StopRoles
│   │   │   │   │   │   ├── StopRoles.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── UserRoles
│   │   │   │   │   │   ├── AddOverRoleModal.js
│   │   │   │   │   │   ├── RoleGroup.js
│   │   │   │   │   │   ├── RoleRow.js
│   │   │   │   │   │   ├── RoleSelectionModal.js
│   │   │   │   │   │   ├── RoleSubGroup.js
│   │   │   │   │   │   ├── RoleTable.js
│   │   │   │   │   │   ├── RoleTableHeader.js
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRoles.js
│   │   │   │   │   ├── UserRolesPage
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRolesPage.js
│   │   │   │   │   └── UserTable
│   │   │   │   │       ├── EditUserModal.js
│   │   │   │   │       ├── style.module.css
│   │   │   │   │       └── UserTable.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── IusPt.js
│   │   │   │   │   ├── IusPtUser.js
│   │   │   │   │   ├── IusSprav.js
│   │   │   │   │   ├── IusUserApplication.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IusPtService.js
│   │   │   │   └── store
│   │   │   │       └── IusPtStore.js
│   │   │   ├── json
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── json.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── notes
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── CreatePost.js
│   │   │   │   │   ├── EditPost.js
│   │   │   │   │   ├── Notes.css
│   │   │   │   │   └── Notes.js
│   │   │   │   ├── routes.js
│   │   │   │   └── services
│   │   │   │       └── NoteService.js
│   │   │   ├── prints
│   │   │   │   ├── components
│   │   │   │   │   ├── PrintAll.js
│   │   │   │   │   ├── PrintChart.js
│   │   │   │   │   ├── PrintCreateModal.js
│   │   │   │   │   ├── PrintEditModal.js
│   │   │   │   │   ├── PrinteEditLocationModal.js
│   │   │   │   │   ├── PrintLocation.js
│   │   │   │   │   ├── PrintModel.js
│   │   │   │   │   └── PrintModelCreateModal.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Prints.css
│   │   │   │   │   └── Prints.js
│   │   │   │   └── services
│   │   │   │       └── PrintsService.js
│   │   │   └── staff
│   │   │       ├── index.js
│   │   │       ├── pages
│   │   │       │   ├── Staff.css
│   │   │       │   ├── Staff.js
│   │   │       │   ├── StaffCreateModal.js
│   │   │       │   ├── StaffEditModal.js
│   │   │       │   ├── StaffImportModal.js
│   │   │       │   ├── StaffSprav.js
│   │   │       │   ├── StaffSpravDepartments.js
│   │   │       │   └── style.module.css
│   │   │       ├── routes.js
│   │   │       ├── services
│   │   │       │   └── StaffService.js
│   │   │       └── store
│   │   │           └── UserStore.js
│   │   ├── Image
│   │   │   ├── 13506.750.jpg
│   │   │   ├── christmas-plains.png
│   │   │   ├── ib.jpg
│   │   │   ├── Landscaping-Logo.png
│   │   │   ├── plug1.jpg
│   │   │   ├── plug2.jpg
│   │   │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│   │   │   ├── UI.jpg
│   │   │   └── wordpress_web_security_header.jpg
│   │   ├── index.js
│   │   └── shared
│   │       └── PrivateRoute.js
│   └── tree.md
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Components
│   │   │   ├── button
│   │   │   │   ├── buttonLogout.js
│   │   │   │   └── style.module.css
│   │   │   ├── circle
│   │   │   │   ├── Circle.js
│   │   │   │   └── Circle.module.css
│   │   │   ├── Clock.js
│   │   │   ├── NavBar
│   │   │   │   ├── NavBar.css
│   │   │   │   └── NavBar.js
│   │   │   └── Table
│   │   │       ├── style.module.css
│   │   │       └── Table.js
│   │   ├── features
│   │   │   ├── admin
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Admin.css
│   │   │   │   │   ├── Admin.js
│   │   │   │   │   ├── AdminCreate.js
│   │   │   │   │   ├── AdminEditUser.js
│   │   │   │   │   ├── LoginPage.js
│   │   │   │   │   ├── PrivateRoute.js
│   │   │   │   │   └── RoleSprav.js
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── AdminService.js
│   │   │   │   └── store
│   │   │   │       └── UserStore.js
│   │   │   ├── ib
│   │   │   │   ├── components
│   │   │   │   │   └── image
│   │   │   │   │       └── i.jpg
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ib.js
│   │   │   │   │   ├── instructions.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── ip
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ipaddress.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IpService.js
│   │   │   │   └── store
│   │   │   │       └── IpStore.js
│   │   │   ├── ius-pt
│   │   │   │   ├── components
│   │   │   │   │   ├── ButtonAll
│   │   │   │   │   │   ├── ButtonAll.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── IusAdm
│   │   │   │   │   │   └── IusAdm.js
│   │   │   │   │   ├── SearchInput
│   │   │   │   │   │   ├── SearchInput.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── SpravRole
│   │   │   │   │   │   ├── AddRoleModal.js
│   │   │   │   │   │   ├── SpravRole.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── StopRoles
│   │   │   │   │   │   ├── StopRoles.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── UserRoles
│   │   │   │   │   │   ├── AddOverRoleModal.js
│   │   │   │   │   │   ├── RoleGroup.js
│   │   │   │   │   │   ├── RoleRow.js
│   │   │   │   │   │   ├── RoleSelectionModal.js
│   │   │   │   │   │   ├── RoleSubGroup.js
│   │   │   │   │   │   ├── RoleTable.js
│   │   │   │   │   │   ├── RoleTableHeader.js
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRoles.js
│   │   │   │   │   ├── UserRolesPage
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRolesPage.js
│   │   │   │   │   └── UserTable
│   │   │   │   │       ├── EditUserModal.js
│   │   │   │   │       ├── style.module.css
│   │   │   │   │       └── UserTable.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── IusPt.js
│   │   │   │   │   ├── IusPtUser.js
│   │   │   │   │   ├── IusSprav.js
│   │   │   │   │   ├── IusUserApplication.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IusPtService.js
│   │   │   │   └── store
│   │   │   │       └── IusPtStore.js
│   │   │   ├── json
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── json.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── notes
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── CreatePost.js
│   │   │   │   │   ├── EditPost.js
│   │   │   │   │   ├── Notes.css
│   │   │   │   │   └── Notes.js
│   │   │   │   ├── routes.js
│   │   │   │   └── services
│   │   │   │       └── NoteService.js
│   │   │   ├── prints
│   │   │   │   ├── components
│   │   │   │   │   ├── PrintAll.js
│   │   │   │   │   ├── PrintChart.js
│   │   │   │   │   ├── PrintCreateModal.js
│   │   │   │   │   ├── PrintEditModal.js
│   │   │   │   │   ├── PrinteEditLocationModal.js
│   │   │   │   │   ├── PrintLocation.js
│   │   │   │   │   ├── PrintModel.js
│   │   │   │   │   └── PrintModelCreateModal.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Prints.css
│   │   │   │   │   └── Prints.js
│   │   │   │   └── services
│   │   │   │       └── PrintsService.js
│   │   │   └── staff
│   │   │       ├── index.js
│   │   │       ├── pages
│   │   │       │   ├── Staff.css
│   │   │       │   ├── Staff.js
│   │   │       │   ├── StaffCreateModal.js
│   │   │       │   ├── StaffEditModal.js
│   │   │       │   ├── StaffImportModal.js
│   │   │       │   ├── StaffSprav.js
│   │   │       │   ├── StaffSpravDepartments.js
│   │   │       │   └── style.module.css
│   │   │       ├── routes.js
│   │   │       ├── services
│   │   │       │   └── StaffService.js
│   │   │       └── store
│   │   │           └── UserStore.js
│   │   ├── Image
│   │   │   ├── 13506.750.jpg
│   │   │   ├── christmas-plains.png
│   │   │   ├── ib.jpg
│   │   │   ├── Landscaping-Logo.png
│   │   │   ├── plug1.jpg
│   │   │   ├── plug2.jpg
│   │   │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│   │   │   ├── UI.jpg
│   │   │   └── wordpress_web_security_header.jpg
│   │   ├── index.js
│   │   └── shared
│   │       └── PrivateRoute.js
│   └── tree.md
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Components
│   │   │   ├── button
│   │   │   │   ├── buttonLogout.js
│   │   │   │   └── style.module.css
│   │   │   ├── circle
│   │   │   │   ├── Circle.js
│   │   │   │   └── Circle.module.css
│   │   │   ├── Clock.js
│   │   │   ├── NavBar
│   │   │   │   ├── NavBar.css
│   │   │   │   └── NavBar.js
│   │   │   └── Table
│   │   │       ├── style.module.css
│   │   │       └── Table.js
│   │   ├── features
│   │   │   ├── admin
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Admin.css
│   │   │   │   │   ├── Admin.js
│   │   │   │   │   ├── AdminCreate.js
│   │   │   │   │   ├── AdminEditUser.js
│   │   │   │   │   ├── LoginPage.js
│   │   │   │   │   ├── PrivateRoute.js
│   │   │   │   │   └── RoleSprav.js
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── AdminService.js
│   │   │   │   └── store
│   │   │   │       └── UserStore.js
│   │   │   ├── ib
│   │   │   │   ├── components
│   │   │   │   │   └── image
│   │   │   │   │       └── i.jpg
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ib.js
│   │   │   │   │   ├── instructions.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── ip
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ipaddress.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IpService.js
│   │   │   │   └── store
│   │   │   │       └── IpStore.js
│   │   │   ├── ius-pt
│   │   │   │   ├── components
│   │   │   │   │   ├── ButtonAll
│   │   │   │   │   │   ├── ButtonAll.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── IusAdm
│   │   │   │   │   │   └── IusAdm.js
│   │   │   │   │   ├── SearchInput
│   │   │   │   │   │   ├── SearchInput.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── SpravRole
│   │   │   │   │   │   ├── AddRoleModal.js
│   │   │   │   │   │   ├── SpravRole.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── StopRoles
│   │   │   │   │   │   ├── StopRoles.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── UserRoles
│   │   │   │   │   │   ├── AddOverRoleModal.js
│   │   │   │   │   │   ├── RoleGroup.js
│   │   │   │   │   │   ├── RoleRow.js
│   │   │   │   │   │   ├── RoleSelectionModal.js
│   │   │   │   │   │   ├── RoleSubGroup.js
│   │   │   │   │   │   ├── RoleTable.js
│   │   │   │   │   │   ├── RoleTableHeader.js
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRoles.js
│   │   │   │   │   ├── UserRolesPage
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRolesPage.js
│   │   │   │   │   └── UserTable
│   │   │   │   │       ├── EditUserModal.js
│   │   │   │   │       ├── style.module.css
│   │   │   │   │       └── UserTable.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── IusPt.js
│   │   │   │   │   ├── IusPtUser.js
│   │   │   │   │   ├── IusSprav.js
│   │   │   │   │   ├── IusUserApplication.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IusPtService.js
│   │   │   │   └── store
│   │   │   │       └── IusPtStore.js
│   │   │   ├── json
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── json.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── notes
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── CreatePost.js
│   │   │   │   │   ├── EditPost.js
│   │   │   │   │   ├── Notes.css
│   │   │   │   │   └── Notes.js
│   │   │   │   ├── routes.js
│   │   │   │   └── services
│   │   │   │       └── NoteService.js
│   │   │   ├── prints
│   │   │   │   ├── components
│   │   │   │   │   ├── PrintAll.js
│   │   │   │   │   ├── PrintChart.js
│   │   │   │   │   ├── PrintCreateModal.js
│   │   │   │   │   ├── PrintEditModal.js
│   │   │   │   │   ├── PrinteEditLocationModal.js
│   │   │   │   │   ├── PrintLocation.js
│   │   │   │   │   ├── PrintModel.js
│   │   │   │   │   └── PrintModelCreateModal.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Prints.css
│   │   │   │   │   └── Prints.js
│   │   │   │   └── services
│   │   │   │       └── PrintsService.js
│   │   │   └── staff
│   │   │       ├── index.js
│   │   │       ├── pages
│   │   │       │   ├── Staff.css
│   │   │       │   ├── Staff.js
│   │   │       │   ├── StaffCreateModal.js
│   │   │       │   ├── StaffEditModal.js
│   │   │       │   ├── StaffImportModal.js
│   │   │       │   ├── StaffSprav.js
│   │   │       │   ├── StaffSpravDepartments.js
│   │   │       │   └── style.module.css
│   │   │       ├── routes.js
│   │   │       ├── services
│   │   │       │   └── StaffService.js
│   │   │       └── store
│   │   │           └── UserStore.js
│   │   ├── Image
│   │   │   ├── 13506.750.jpg
│   │   │   ├── christmas-plains.png
│   │   │   ├── ib.jpg
│   │   │   ├── Landscaping-Logo.png
│   │   │   ├── plug1.jpg
│   │   │   ├── plug2.jpg
│   │   │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│   │   │   ├── UI.jpg
│   │   │   └── wordpress_web_security_header.jpg
│   │   ├── index.js
│   │   └── shared
│   │       └── PrivateRoute.js
│   └── tree.md
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Components
│   │   │   ├── button
│   │   │   │   ├── buttonLogout.js
│   │   │   │   └── style.module.css
│   │   │   ├── circle
│   │   │   │   ├── Circle.js
│   │   │   │   └── Circle.module.css
│   │   │   ├── Clock.js
│   │   │   ├── NavBar
│   │   │   │   ├── NavBar.css
│   │   │   │   └── NavBar.js
│   │   │   └── Table
│   │   │       ├── style.module.css
│   │   │       └── Table.js
│   │   ├── features
│   │   │   ├── admin
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Admin.css
│   │   │   │   │   ├── Admin.js
│   │   │   │   │   ├── AdminCreate.js
│   │   │   │   │   ├── AdminEditUser.js
│   │   │   │   │   ├── LoginPage.js
│   │   │   │   │   ├── PrivateRoute.js
│   │   │   │   │   └── RoleSprav.js
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── AdminService.js
│   │   │   │   └── store
│   │   │   │       └── UserStore.js
│   │   │   ├── ib
│   │   │   │   ├── components
│   │   │   │   │   └── image
│   │   │   │   │       └── i.jpg
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ib.js
│   │   │   │   │   ├── instructions.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── ip
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ipaddress.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IpService.js
│   │   │   │   └── store
│   │   │   │       └── IpStore.js
│   │   │   ├── ius-pt
│   │   │   │   ├── components
│   │   │   │   │   ├── ButtonAll
│   │   │   │   │   │   ├── ButtonAll.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── IusAdm
│   │   │   │   │   │   └── IusAdm.js
│   │   │   │   │   ├── SearchInput
│   │   │   │   │   │   ├── SearchInput.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── SpravRole
│   │   │   │   │   │   ├── AddRoleModal.js
│   │   │   │   │   │   ├── SpravRole.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── StopRoles
│   │   │   │   │   │   ├── StopRoles.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── UserRoles
│   │   │   │   │   │   ├── AddOverRoleModal.js
│   │   │   │   │   │   ├── RoleGroup.js
│   │   │   │   │   │   ├── RoleRow.js
│   │   │   │   │   │   ├── RoleSelectionModal.js
│   │   │   │   │   │   ├── RoleSubGroup.js
│   │   │   │   │   │   ├── RoleTable.js
│   │   │   │   │   │   ├── RoleTableHeader.js
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRoles.js
│   │   │   │   │   ├── UserRolesPage
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRolesPage.js
│   │   │   │   │   └── UserTable
│   │   │   │   │       ├── EditUserModal.js
│   │   │   │   │       ├── style.module.css
│   │   │   │   │       └── UserTable.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── IusPt.js
│   │   │   │   │   ├── IusPtUser.js
│   │   │   │   │   ├── IusSprav.js
│   │   │   │   │   ├── IusUserApplication.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IusPtService.js
│   │   │   │   └── store
│   │   │   │       └── IusPtStore.js
│   │   │   ├── json
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── json.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── notes
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── CreatePost.js
│   │   │   │   │   ├── EditPost.js
│   │   │   │   │   ├── Notes.css
│   │   │   │   │   └── Notes.js
│   │   │   │   ├── routes.js
│   │   │   │   └── services
│   │   │   │       └── NoteService.js
│   │   │   ├── prints
│   │   │   │   ├── components
│   │   │   │   │   ├── PrintAll.js
│   │   │   │   │   ├── PrintChart.js
│   │   │   │   │   ├── PrintCreateModal.js
│   │   │   │   │   ├── PrintEditModal.js
│   │   │   │   │   ├── PrinteEditLocationModal.js
│   │   │   │   │   ├── PrintLocation.js
│   │   │   │   │   ├── PrintModel.js
│   │   │   │   │   └── PrintModelCreateModal.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Prints.css
│   │   │   │   │   └── Prints.js
│   │   │   │   └── services
│   │   │   │       └── PrintsService.js
│   │   │   └── staff
│   │   │       ├── index.js
│   │   │       ├── pages
│   │   │       │   ├── Staff.css
│   │   │       │   ├── Staff.js
│   │   │       │   ├── StaffCreateModal.js
│   │   │       │   ├── StaffEditModal.js
│   │   │       │   ├── StaffImportModal.js
│   │   │       │   ├── StaffSprav.js
│   │   │       │   ├── StaffSpravDepartments.js
│   │   │       │   └── style.module.css
│   │   │       ├── routes.js
│   │   │       ├── services
│   │   │       │   └── StaffService.js
│   │   │       └── store
│   │   │           └── UserStore.js
│   │   ├── Image
│   │   │   ├── 13506.750.jpg
│   │   │   ├── christmas-plains.png
│   │   │   ├── ib.jpg
│   │   │   ├── Landscaping-Logo.png
│   │   │   ├── plug1.jpg
│   │   │   ├── plug2.jpg
│   │   │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│   │   │   ├── UI.jpg
│   │   │   └── wordpress_web_security_header.jpg
│   │   ├── index.js
│   │   └── shared
│   │       └── PrivateRoute.js
│   └── tree.md
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Components
│   │   │   ├── button
│   │   │   │   ├── buttonLogout.js
│   │   │   │   └── style.module.css
│   │   │   ├── circle
│   │   │   │   ├── Circle.js
│   │   │   │   └── Circle.module.css
│   │   │   ├── Clock.js
│   │   │   ├── NavBar
│   │   │   │   ├── NavBar.css
│   │   │   │   └── NavBar.js
│   │   │   └── Table
│   │   │       ├── style.module.css
│   │   │       └── Table.js
│   │   ├── features
│   │   │   ├── admin
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Admin.css
│   │   │   │   │   ├── Admin.js
│   │   │   │   │   ├── AdminCreate.js
│   │   │   │   │   ├── AdminEditUser.js
│   │   │   │   │   ├── LoginPage.js
│   │   │   │   │   ├── PrivateRoute.js
│   │   │   │   │   └── RoleSprav.js
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── AdminService.js
│   │   │   │   └── store
│   │   │   │       └── UserStore.js
│   │   │   ├── ib
│   │   │   │   ├── components
│   │   │   │   │   └── image
│   │   │   │   │       └── i.jpg
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ib.js
│   │   │   │   │   ├── instructions.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── ip
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ipaddress.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IpService.js
│   │   │   │   └── store
│   │   │   │       └── IpStore.js
│   │   │   ├── ius-pt
│   │   │   │   ├── components
│   │   │   │   │   ├── ButtonAll
│   │   │   │   │   │   ├── ButtonAll.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── IusAdm
│   │   │   │   │   │   └── IusAdm.js
│   │   │   │   │   ├── SearchInput
│   │   │   │   │   │   ├── SearchInput.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── SpravRole
│   │   │   │   │   │   ├── AddRoleModal.js
│   │   │   │   │   │   ├── SpravRole.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── StopRoles
│   │   │   │   │   │   ├── StopRoles.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── UserRoles
│   │   │   │   │   │   ├── AddOverRoleModal.js
│   │   │   │   │   │   ├── RoleGroup.js
│   │   │   │   │   │   ├── RoleRow.js
│   │   │   │   │   │   ├── RoleSelectionModal.js
│   │   │   │   │   │   ├── RoleSubGroup.js
│   │   │   │   │   │   ├── RoleTable.js
│   │   │   │   │   │   ├── RoleTableHeader.js
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRoles.js
│   │   │   │   │   ├── UserRolesPage
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRolesPage.js
│   │   │   │   │   └── UserTable
│   │   │   │   │       ├── EditUserModal.js
│   │   │   │   │       ├── style.module.css
│   │   │   │   │       └── UserTable.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── IusPt.js
│   │   │   │   │   ├── IusPtUser.js
│   │   │   │   │   ├── IusSprav.js
│   │   │   │   │   ├── IusUserApplication.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IusPtService.js
│   │   │   │   └── store
│   │   │   │       └── IusPtStore.js
│   │   │   ├── json
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── json.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── notes
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── CreatePost.js
│   │   │   │   │   ├── EditPost.js
│   │   │   │   │   ├── Notes.css
│   │   │   │   │   └── Notes.js
│   │   │   │   ├── routes.js
│   │   │   │   └── services
│   │   │   │       └── NoteService.js
│   │   │   ├── prints
│   │   │   │   ├── components
│   │   │   │   │   ├── PrintAll.js
│   │   │   │   │   ├── PrintChart.js
│   │   │   │   │   ├── PrintCreateModal.js
│   │   │   │   │   ├── PrintEditModal.js
│   │   │   │   │   ├── PrinteEditLocationModal.js
│   │   │   │   │   ├── PrintLocation.js
│   │   │   │   │   ├── PrintModel.js
│   │   │   │   │   └── PrintModelCreateModal.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Prints.css
│   │   │   │   │   └── Prints.js
│   │   │   │   └── services
│   │   │   │       └── PrintsService.js
│   │   │   └── staff
│   │   │       ├── index.js
│   │   │       ├── pages
│   │   │       │   ├── Staff.css
│   │   │       │   ├── Staff.js
│   │   │       │   ├── StaffCreateModal.js
│   │   │       │   ├── StaffEditModal.js
│   │   │       │   ├── StaffImportModal.js
│   │   │       │   ├── StaffSprav.js
│   │   │       │   ├── StaffSpravDepartments.js
│   │   │       │   └── style.module.css
│   │   │       ├── routes.js
│   │   │       ├── services
│   │   │       │   └── StaffService.js
│   │   │       └── store
│   │   │           └── UserStore.js
│   │   ├── Image
│   │   │   ├── 13506.750.jpg
│   │   │   ├── christmas-plains.png
│   │   │   ├── ib.jpg
│   │   │   ├── Landscaping-Logo.png
│   │   │   ├── plug1.jpg
│   │   │   ├── plug2.jpg
│   │   │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│   │   │   ├── UI.jpg
│   │   │   └── wordpress_web_security_header.jpg
│   │   ├── index.js
│   │   └── shared
│   │       └── PrivateRoute.js
│   └── tree.md
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Components
│   │   │   ├── button
│   │   │   │   ├── buttonLogout.js
│   │   │   │   └── style.module.css
│   │   │   ├── circle
│   │   │   │   ├── Circle.js
│   │   │   │   └── Circle.module.css
│   │   │   ├── Clock.js
│   │   │   ├── NavBar
│   │   │   │   ├── NavBar.css
│   │   │   │   └── NavBar.js
│   │   │   └── Table
│   │   │       ├── style.module.css
│   │   │       └── Table.js
│   │   ├── features
│   │   │   ├── admin
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Admin.css
│   │   │   │   │   ├── Admin.js
│   │   │   │   │   ├── AdminCreate.js
│   │   │   │   │   ├── AdminEditUser.js
│   │   │   │   │   ├── LoginPage.js
│   │   │   │   │   ├── PrivateRoute.js
│   │   │   │   │   └── RoleSprav.js
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── AdminService.js
│   │   │   │   └── store
│   │   │   │       └── UserStore.js
│   │   │   ├── ib
│   │   │   │   ├── components
│   │   │   │   │   └── image
│   │   │   │   │       └── i.jpg
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ib.js
│   │   │   │   │   ├── instructions.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── ip
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ipaddress.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IpService.js
│   │   │   │   └── store
│   │   │   │       └── IpStore.js
│   │   │   ├── ius-pt
│   │   │   │   ├── components
│   │   │   │   │   ├── ButtonAll
│   │   │   │   │   │   ├── ButtonAll.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── IusAdm
│   │   │   │   │   │   └── IusAdm.js
│   │   │   │   │   ├── SearchInput
│   │   │   │   │   │   ├── SearchInput.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── SpravRole
│   │   │   │   │   │   ├── AddRoleModal.js
│   │   │   │   │   │   ├── SpravRole.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── StopRoles
│   │   │   │   │   │   ├── StopRoles.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── UserRoles
│   │   │   │   │   │   ├── AddOverRoleModal.js
│   │   │   │   │   │   ├── RoleGroup.js
│   │   │   │   │   │   ├── RoleRow.js
│   │   │   │   │   │   ├── RoleSelectionModal.js
│   │   │   │   │   │   ├── RoleSubGroup.js
│   │   │   │   │   │   ├── RoleTable.js
│   │   │   │   │   │   ├── RoleTableHeader.js
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRoles.js
│   │   │   │   │   ├── UserRolesPage
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRolesPage.js
│   │   │   │   │   └── UserTable
│   │   │   │   │       ├── EditUserModal.js
│   │   │   │   │       ├── style.module.css
│   │   │   │   │       └── UserTable.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── IusPt.js
│   │   │   │   │   ├── IusPtUser.js
│   │   │   │   │   ├── IusSprav.js
│   │   │   │   │   ├── IusUserApplication.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IusPtService.js
│   │   │   │   └── store
│   │   │   │       └── IusPtStore.js
│   │   │   ├── json
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── json.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── notes
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── CreatePost.js
│   │   │   │   │   ├── EditPost.js
│   │   │   │   │   ├── Notes.css
│   │   │   │   │   └── Notes.js
│   │   │   │   ├── routes.js
│   │   │   │   └── services
│   │   │   │       └── NoteService.js
│   │   │   ├── prints
│   │   │   │   ├── components
│   │   │   │   │   ├── PrintAll.js
│   │   │   │   │   ├── PrintChart.js
│   │   │   │   │   ├── PrintCreateModal.js
│   │   │   │   │   ├── PrintEditModal.js
│   │   │   │   │   ├── PrinteEditLocationModal.js
│   │   │   │   │   ├── PrintLocation.js
│   │   │   │   │   ├── PrintModel.js
│   │   │   │   │   └── PrintModelCreateModal.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Prints.css
│   │   │   │   │   └── Prints.js
│   │   │   │   └── services
│   │   │   │       └── PrintsService.js
│   │   │   └── staff
│   │   │       ├── index.js
│   │   │       ├── pages
│   │   │       │   ├── Staff.css
│   │   │       │   ├── Staff.js
│   │   │       │   ├── StaffCreateModal.js
│   │   │       │   ├── StaffEditModal.js
│   │   │       │   ├── StaffImportModal.js
│   │   │       │   ├── StaffSprav.js
│   │   │       │   ├── StaffSpravDepartments.js
│   │   │       │   └── style.module.css
│   │   │       ├── routes.js
│   │   │       ├── services
│   │   │       │   └── StaffService.js
│   │   │       └── store
│   │   │           └── UserStore.js
│   │   ├── Image
│   │   │   ├── 13506.750.jpg
│   │   │   ├── christmas-plains.png
│   │   │   ├── ib.jpg
│   │   │   ├── Landscaping-Logo.png
│   │   │   ├── plug1.jpg
│   │   │   ├── plug2.jpg
│   │   │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│   │   │   ├── UI.jpg
│   │   │   └── wordpress_web_security_header.jpg
│   │   ├── index.js
│   │   └── shared
│   │       └── PrivateRoute.js
│   └── tree.md
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Components
│   │   │   ├── button
│   │   │   │   ├── buttonLogout.js
│   │   │   │   └── style.module.css
│   │   │   ├── circle
│   │   │   │   ├── Circle.js
│   │   │   │   └── Circle.module.css
│   │   │   ├── Clock.js
│   │   │   ├── NavBar
│   │   │   │   ├── NavBar.css
│   │   │   │   └── NavBar.js
│   │   │   └── Table
│   │   │       ├── style.module.css
│   │   │       └── Table.js
│   │   ├── features
│   │   │   ├── admin
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Admin.css
│   │   │   │   │   ├── Admin.js
│   │   │   │   │   ├── AdminCreate.js
│   │   │   │   │   ├── AdminEditUser.js
│   │   │   │   │   ├── LoginPage.js
│   │   │   │   │   ├── PrivateRoute.js
│   │   │   │   │   └── RoleSprav.js
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── AdminService.js
│   │   │   │   └── store
│   │   │   │       └── UserStore.js
│   │   │   ├── ib
│   │   │   │   ├── components
│   │   │   │   │   └── image
│   │   │   │   │       └── i.jpg
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ib.js
│   │   │   │   │   ├── instructions.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── ip
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ipaddress.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IpService.js
│   │   │   │   └── store
│   │   │   │       └── IpStore.js
│   │   │   ├── ius-pt
│   │   │   │   ├── components
│   │   │   │   │   ├── ButtonAll
│   │   │   │   │   │   ├── ButtonAll.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── IusAdm
│   │   │   │   │   │   └── IusAdm.js
│   │   │   │   │   ├── SearchInput
│   │   │   │   │   │   ├── SearchInput.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── SpravRole
│   │   │   │   │   │   ├── AddRoleModal.js
│   │   │   │   │   │   ├── SpravRole.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── StopRoles
│   │   │   │   │   │   ├── StopRoles.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── UserRoles
│   │   │   │   │   │   ├── AddOverRoleModal.js
│   │   │   │   │   │   ├── RoleGroup.js
│   │   │   │   │   │   ├── RoleRow.js
│   │   │   │   │   │   ├── RoleSelectionModal.js
│   │   │   │   │   │   ├── RoleSubGroup.js
│   │   │   │   │   │   ├── RoleTable.js
│   │   │   │   │   │   ├── RoleTableHeader.js
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRoles.js
│   │   │   │   │   ├── UserRolesPage
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRolesPage.js
│   │   │   │   │   └── UserTable
│   │   │   │   │       ├── EditUserModal.js
│   │   │   │   │       ├── style.module.css
│   │   │   │   │       └── UserTable.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── IusPt.js
│   │   │   │   │   ├── IusPtUser.js
│   │   │   │   │   ├── IusSprav.js
│   │   │   │   │   ├── IusUserApplication.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IusPtService.js
│   │   │   │   └── store
│   │   │   │       └── IusPtStore.js
│   │   │   ├── json
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── json.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── notes
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── CreatePost.js
│   │   │   │   │   ├── EditPost.js
│   │   │   │   │   ├── Notes.css
│   │   │   │   │   └── Notes.js
│   │   │   │   ├── routes.js
│   │   │   │   └── services
│   │   │   │       └── NoteService.js
│   │   │   ├── prints
│   │   │   │   ├── components
│   │   │   │   │   ├── PrintAll.js
│   │   │   │   │   ├── PrintChart.js
│   │   │   │   │   ├── PrintCreateModal.js
│   │   │   │   │   ├── PrintEditModal.js
│   │   │   │   │   ├── PrinteEditLocationModal.js
│   │   │   │   │   ├── PrintLocation.js
│   │   │   │   │   ├── PrintModel.js
│   │   │   │   │   └── PrintModelCreateModal.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Prints.css
│   │   │   │   │   └── Prints.js
│   │   │   │   └── services
│   │   │   │       └── PrintsService.js
│   │   │   └── staff
│   │   │       ├── index.js
│   │   │       ├── pages
│   │   │       │   ├── Staff.css
│   │   │       │   ├── Staff.js
│   │   │       │   ├── StaffCreateModal.js
│   │   │       │   ├── StaffEditModal.js
│   │   │       │   ├── StaffImportModal.js
│   │   │       │   ├── StaffSprav.js
│   │   │       │   ├── StaffSpravDepartments.js
│   │   │       │   └── style.module.css
│   │   │       ├── routes.js
│   │   │       ├── services
│   │   │       │   └── StaffService.js
│   │   │       └── store
│   │   │           └── UserStore.js
│   │   ├── Image
│   │   │   ├── 13506.750.jpg
│   │   │   ├── christmas-plains.png
│   │   │   ├── ib.jpg
│   │   │   ├── Landscaping-Logo.png
│   │   │   ├── plug1.jpg
│   │   │   ├── plug2.jpg
│   │   │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│   │   │   ├── UI.jpg
│   │   │   └── wordpress_web_security_header.jpg
│   │   ├── index.js
│   │   └── shared
│   │       └── PrivateRoute.js
│   └── tree.md
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Components
│   │   │   ├── button
│   │   │   │   ├── buttonLogout.js
│   │   │   │   └── style.module.css
│   │   │   ├── circle
│   │   │   │   ├── Circle.js
│   │   │   │   └── Circle.module.css
│   │   │   ├── Clock.js
│   │   │   ├── NavBar
│   │   │   │   ├── NavBar.css
│   │   │   │   └── NavBar.js
│   │   │   └── Table
│   │   │       ├── style.module.css
│   │   │       └── Table.js
│   │   ├── features
│   │   │   ├── admin
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Admin.css
│   │   │   │   │   ├── Admin.js
│   │   │   │   │   ├── AdminCreate.js
│   │   │   │   │   ├── AdminEditUser.js
│   │   │   │   │   ├── LoginPage.js
│   │   │   │   │   ├── PrivateRoute.js
│   │   │   │   │   └── RoleSprav.js
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── AdminService.js
│   │   │   │   └── store
│   │   │   │       └── UserStore.js
│   │   │   ├── ib
│   │   │   │   ├── components
│   │   │   │   │   └── image
│   │   │   │   │       └── i.jpg
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ib.js
│   │   │   │   │   ├── instructions.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── ip
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ipaddress.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IpService.js
│   │   │   │   └── store
│   │   │   │       └── IpStore.js
│   │   │   ├── ius-pt
│   │   │   │   ├── components
│   │   │   │   │   ├── ButtonAll
│   │   │   │   │   │   ├── ButtonAll.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── IusAdm
│   │   │   │   │   │   └── IusAdm.js
│   │   │   │   │   ├── SearchInput
│   │   │   │   │   │   ├── SearchInput.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── SpravRole
│   │   │   │   │   │   ├── AddRoleModal.js
│   │   │   │   │   │   ├── SpravRole.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── StopRoles
│   │   │   │   │   │   ├── StopRoles.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── UserRoles
│   │   │   │   │   │   ├── AddOverRoleModal.js
│   │   │   │   │   │   ├── RoleGroup.js
│   │   │   │   │   │   ├── RoleRow.js
│   │   │   │   │   │   ├── RoleSelectionModal.js
│   │   │   │   │   │   ├── RoleSubGroup.js
│   │   │   │   │   │   ├── RoleTable.js
│   │   │   │   │   │   ├── RoleTableHeader.js
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRoles.js
│   │   │   │   │   ├── UserRolesPage
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRolesPage.js
│   │   │   │   │   └── UserTable
│   │   │   │   │       ├── EditUserModal.js
│   │   │   │   │       ├── style.module.css
│   │   │   │   │       └── UserTable.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── IusPt.js
│   │   │   │   │   ├── IusPtUser.js
│   │   │   │   │   ├── IusSprav.js
│   │   │   │   │   ├── IusUserApplication.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IusPtService.js
│   │   │   │   └── store
│   │   │   │       └── IusPtStore.js
│   │   │   ├── json
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── json.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── notes
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── CreatePost.js
│   │   │   │   │   ├── EditPost.js
│   │   │   │   │   ├── Notes.css
│   │   │   │   │   └── Notes.js
│   │   │   │   ├── routes.js
│   │   │   │   └── services
│   │   │   │       └── NoteService.js
│   │   │   ├── prints
│   │   │   │   ├── components
│   │   │   │   │   ├── PrintAll.js
│   │   │   │   │   ├── PrintChart.js
│   │   │   │   │   ├── PrintCreateModal.js
│   │   │   │   │   ├── PrintEditModal.js
│   │   │   │   │   ├── PrinteEditLocationModal.js
│   │   │   │   │   ├── PrintLocation.js
│   │   │   │   │   ├── PrintModel.js
│   │   │   │   │   └── PrintModelCreateModal.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Prints.css
│   │   │   │   │   └── Prints.js
│   │   │   │   └── services
│   │   │   │       └── PrintsService.js
│   │   │   └── staff
│   │   │       ├── index.js
│   │   │       ├── pages
│   │   │       │   ├── Staff.css
│   │   │       │   ├── Staff.js
│   │   │       │   ├── StaffCreateModal.js
│   │   │       │   ├── StaffEditModal.js
│   │   │       │   ├── StaffImportModal.js
│   │   │       │   ├── StaffSprav.js
│   │   │       │   ├── StaffSpravDepartments.js
│   │   │       │   └── style.module.css
│   │   │       ├── routes.js
│   │   │       ├── services
│   │   │       │   └── StaffService.js
│   │   │       └── store
│   │   │           └── UserStore.js
│   │   ├── Image
│   │   │   ├── 13506.750.jpg
│   │   │   ├── christmas-plains.png
│   │   │   ├── ib.jpg
│   │   │   ├── Landscaping-Logo.png
│   │   │   ├── plug1.jpg
│   │   │   ├── plug2.jpg
│   │   │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│   │   │   ├── UI.jpg
│   │   │   └── wordpress_web_security_header.jpg
│   │   ├── index.js
│   │   └── shared
│   │       └── PrivateRoute.js
│   └── tree.md
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── Components
│   │   │   ├── button
│   │   │   │   ├── buttonLogout.js
│   │   │   │   └── style.module.css
│   │   │   ├── circle
│   │   │   │   ├── Circle.js
│   │   │   │   └── Circle.module.css
│   │   │   ├── Clock.js
│   │   │   ├── NavBar
│   │   │   │   ├── NavBar.css
│   │   │   │   └── NavBar.js
│   │   │   └── Table
│   │   │       ├── style.module.css
│   │   │       └── Table.js
│   │   ├── features
│   │   │   ├── admin
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Admin.css
│   │   │   │   │   ├── Admin.js
│   │   │   │   │   ├── AdminCreate.js
│   │   │   │   │   ├── AdminEditUser.js
│   │   │   │   │   ├── LoginPage.js
│   │   │   │   │   ├── PrivateRoute.js
│   │   │   │   │   └── RoleSprav.js
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── AdminService.js
│   │   │   │   └── store
│   │   │   │       └── UserStore.js
│   │   │   ├── ib
│   │   │   │   ├── components
│   │   │   │   │   └── image
│   │   │   │   │       └── i.jpg
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ib.js
│   │   │   │   │   ├── instructions.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── ip
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── ipaddress.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IpService.js
│   │   │   │   └── store
│   │   │   │       └── IpStore.js
│   │   │   ├── ius-pt
│   │   │   │   ├── components
│   │   │   │   │   ├── ButtonAll
│   │   │   │   │   │   ├── ButtonAll.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── IusAdm
│   │   │   │   │   │   └── IusAdm.js
│   │   │   │   │   ├── SearchInput
│   │   │   │   │   │   ├── SearchInput.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── SpravRole
│   │   │   │   │   │   ├── AddRoleModal.js
│   │   │   │   │   │   ├── SpravRole.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── StopRoles
│   │   │   │   │   │   ├── StopRoles.js
│   │   │   │   │   │   └── style.module.css
│   │   │   │   │   ├── UserRoles
│   │   │   │   │   │   ├── AddOverRoleModal.js
│   │   │   │   │   │   ├── RoleGroup.js
│   │   │   │   │   │   ├── RoleRow.js
│   │   │   │   │   │   ├── RoleSelectionModal.js
│   │   │   │   │   │   ├── RoleSubGroup.js
│   │   │   │   │   │   ├── RoleTable.js
│   │   │   │   │   │   ├── RoleTableHeader.js
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRoles.js
│   │   │   │   │   ├── UserRolesPage
│   │   │   │   │   │   ├── style.module.css
│   │   │   │   │   │   └── UserRolesPage.js
│   │   │   │   │   └── UserTable
│   │   │   │   │       ├── EditUserModal.js
│   │   │   │   │       ├── style.module.css
│   │   │   │   │       └── UserTable.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── IusPt.js
│   │   │   │   │   ├── IusPtUser.js
│   │   │   │   │   ├── IusSprav.js
│   │   │   │   │   ├── IusUserApplication.js
│   │   │   │   │   └── style.module.css
│   │   │   │   ├── routes.js
│   │   │   │   ├── services
│   │   │   │   │   └── IusPtService.js
│   │   │   │   └── store
│   │   │   │       └── IusPtStore.js
│   │   │   ├── json
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── json.js
│   │   │   │   │   └── style.module.css
│   │   │   │   └── routes.js
│   │   │   ├── notes
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── CreatePost.js
│   │   │   │   │   ├── EditPost.js
│   │   │   │   │   ├── Notes.css
│   │   │   │   │   └── Notes.js
│   │   │   │   ├── routes.js
│   │   │   │   └── services
│   │   │   │       └── NoteService.js
│   │   │   ├── prints
│   │   │   │   ├── components
│   │   │   │   │   ├── PrintAll.js
│   │   │   │   │   ├── PrintChart.js
│   │   │   │   │   ├── PrintCreateModal.js
│   │   │   │   │   ├── PrintEditModal.js
│   │   │   │   │   ├── PrinteEditLocationModal.js
│   │   │   │   │   ├── PrintLocation.js
│   │   │   │   │   ├── PrintModel.js
│   │   │   │   │   └── PrintModelCreateModal.js
│   │   │   │   ├── index.js
│   │   │   │   ├── pages
│   │   │   │   │   ├── Prints.css
│   │   │   │   │   └── Prints.js
│   │   │   │   └── services
│   │   │   │       └── PrintsService.js
│   │   │   └── staff
│   │   │       ├── index.js
│   │   │       ├── pages
│   │   │       │   ├── Staff.css
│   │   │       │   ├── Staff.js
│   │   │       │   ├── StaffCreateModal.js
│   │   │       │   ├── StaffEditModal.js
│   │   │       │   ├── StaffImportModal.js
│   │   │       │   ├── StaffSprav.js
│   │   │       │   ├── StaffSpravDepartments.js
│   │   │       │   └── style.module.css
│   │   │       ├── routes.js
│   │   │       ├── services
│   │   │       │   └── StaffService.js
│   │   │       └── store
│   │   │           └── UserStore.js
│   │   ├── Image
│   │   │   ├── 13506.750.jpg
│   │   │   ├── christmas-plains.png
│   │   │   ├── ib.jpg
│   │   │   ├── Landscaping-Logo.png
│   │   │   ├── plug1.jpg
│   │   │   ├── plug2.jpg
│   │   │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│   │   │   ├── UI.jpg
│   │   │   └── wordpress_web_security_header.jpg
│   │   ├── index.js
│   │   └── shared
│   │       └── PrivateRoute.js
│   └── tree.md
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── src
│       ├── App.css
│       ├── App.js
│       ├── Components
│       │   ├── button
│       │   │   ├── buttonLogout.js
│       │   │   └── style.module.css
│       │   ├── circle
│       │   │   ├── Circle.js
│       │   │   └── Circle.module.css
│       │   ├── Clock.js
│       │   ├── NavBar
│       │   │   ├── NavBar.css
│       │   │   └── NavBar.js
│       │   └── Table
│       │       ├── style.module.css
│       │       └── Table.js
│       ├── features
│       │   ├── admin
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── Admin.css
│       │   │   │   ├── Admin.js
│       │   │   │   ├── AdminCreate.js
│       │   │   │   ├── AdminEditUser.js
│       │   │   │   ├── LoginPage.js
│       │   │   │   ├── PrivateRoute.js
│       │   │   │   └── RoleSprav.js
│       │   │   ├── routes.js
│       │   │   ├── services
│       │   │   │   └── AdminService.js
│       │   │   └── store
│       │   │       └── UserStore.js
│       │   ├── ib
│       │   │   ├── components
│       │   │   │   └── image
│       │   │   │       └── i.jpg
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── ib.js
│       │   │   │   ├── instructions.js
│       │   │   │   └── style.module.css
│       │   │   └── routes.js
│       │   ├── ip
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── ipaddress.js
│       │   │   │   └── style.module.css
│       │   │   ├── routes.js
│       │   │   ├── services
│       │   │   │   └── IpService.js
│       │   │   └── store
│       │   │       └── IpStore.js
│       │   ├── ius-pt
│       │   │   ├── components
│       │   │   │   ├── ButtonAll
│       │   │   │   │   ├── ButtonAll.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── IusAdm
│       │   │   │   │   └── IusAdm.js
│       │   │   │   ├── SearchInput
│       │   │   │   │   ├── SearchInput.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── SpravRole
│       │   │   │   │   ├── AddRoleModal.js
│       │   │   │   │   ├── SpravRole.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── StopRoles
│       │   │   │   │   ├── StopRoles.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── UserRoles
│       │   │   │   │   ├── AddOverRoleModal.js
│       │   │   │   │   ├── RoleGroup.js
│       │   │   │   │   ├── RoleRow.js
│       │   │   │   │   ├── RoleSelectionModal.js
│       │   │   │   │   ├── RoleSubGroup.js
│       │   │   │   │   ├── RoleTable.js
│       │   │   │   │   ├── RoleTableHeader.js
│       │   │   │   │   ├── style.module.css
│       │   │   │   │   └── UserRoles.js
│       │   │   │   ├── UserRolesPage
│       │   │   │   │   ├── style.module.css
│       │   │   │   │   └── UserRolesPage.js
│       │   │   │   └── UserTable
│       │   │   │       ├── EditUserModal.js
│       │   │   │       ├── style.module.css
│       │   │   │       └── UserTable.js
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── IusPt.js
│       │   │   │   ├── IusPtUser.js
│       │   │   │   ├── IusSprav.js
│       │   │   │   ├── IusUserApplication.js
│       │   │   │   └── style.module.css
│       │   │   ├── routes.js
│       │   │   ├── services
│       │   │   │   └── IusPtService.js
│       │   │   └── store
│       │   │       └── IusPtStore.js
│       │   ├── json
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── json.js
│       │   │   │   └── style.module.css
│       │   │   └── routes.js
│       │   ├── notes
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── CreatePost.js
│       │   │   │   ├── EditPost.js
│       │   │   │   ├── Notes.css
│       │   │   │   └── Notes.js
│       │   │   ├── routes.js
│       │   │   └── services
│       │   │       └── NoteService.js
│       │   ├── prints
│       │   │   ├── components
│       │   │   │   ├── PrintAll.js
│       │   │   │   ├── PrintChart.js
│       │   │   │   ├── PrintCreateModal.js
│       │   │   │   ├── PrintEditModal.js
│       │   │   │   ├── PrinteEditLocationModal.js
│       │   │   │   ├── PrintLocation.js
│       │   │   │   ├── PrintModel.js
│       │   │   │   └── PrintModelCreateModal.js
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── Prints.css
│       │   │   │   └── Prints.js
│       │   │   └── services
│       │   │       └── PrintsService.js
│       │   └── staff
│       │       ├── index.js
│       │       ├── pages
│       │       │   ├── Staff.css
│       │       │   ├── Staff.js
│       │       │   ├── StaffCreateModal.js
│       │       │   ├── StaffEditModal.js
│       │       │   ├── StaffImportModal.js
│       │       │   ├── StaffSprav.js
│       │       │   ├── StaffSpravDepartments.js
│       │       │   └── style.module.css
│       │       ├── routes.js
│       │       ├── services
│       │       │   └── StaffService.js
│       │       └── store
│       │           └── UserStore.js
│       ├── Image
│       │   ├── 13506.750.jpg
│       │   ├── christmas-plains.png
│       │   ├── ib.jpg
│       │   ├── Landscaping-Logo.png
│       │   ├── plug1.jpg
│       │   ├── plug2.jpg
│       │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│       │   ├── UI.jpg
│       │   └── wordpress_web_security_header.jpg
│       ├── index.js
│       └── shared
│           └── PrivateRoute.js
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── src
│       ├── App.css
│       ├── App.js
│       ├── Components
│       │   ├── button
│       │   │   ├── buttonLogout.js
│       │   │   └── style.module.css
│       │   ├── circle
│       │   │   ├── Circle.js
│       │   │   └── Circle.module.css
│       │   ├── Clock.js
│       │   ├── NavBar
│       │   │   ├── NavBar.css
│       │   │   └── NavBar.js
│       │   └── Table
│       │       ├── style.module.css
│       │       └── Table.js
│       ├── features
│       │   ├── admin
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── Admin.css
│       │   │   │   ├── Admin.js
│       │   │   │   ├── AdminCreate.js
│       │   │   │   ├── AdminEditUser.js
│       │   │   │   ├── LoginPage.js
│       │   │   │   ├── PrivateRoute.js
│       │   │   │   └── RoleSprav.js
│       │   │   ├── routes.js
│       │   │   ├── services
│       │   │   │   └── AdminService.js
│       │   │   └── store
│       │   │       └── UserStore.js
│       │   ├── ib
│       │   │   ├── components
│       │   │   │   └── image
│       │   │   │       └── i.jpg
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── ib.js
│       │   │   │   ├── instructions.js
│       │   │   │   └── style.module.css
│       │   │   └── routes.js
│       │   ├── ip
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── ipaddress.js
│       │   │   │   └── style.module.css
│       │   │   ├── routes.js
│       │   │   ├── services
│       │   │   │   └── IpService.js
│       │   │   └── store
│       │   │       └── IpStore.js
│       │   ├── ius-pt
│       │   │   ├── components
│       │   │   │   ├── ButtonAll
│       │   │   │   │   ├── ButtonAll.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── IusAdm
│       │   │   │   │   └── IusAdm.js
│       │   │   │   ├── SearchInput
│       │   │   │   │   ├── SearchInput.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── SpravRole
│       │   │   │   │   ├── AddRoleModal.js
│       │   │   │   │   ├── SpravRole.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── StopRoles
│       │   │   │   │   ├── StopRoles.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── UserRoles
│       │   │   │   │   ├── AddOverRoleModal.js
│       │   │   │   │   ├── RoleGroup.js
│       │   │   │   │   ├── RoleRow.js
│       │   │   │   │   ├── RoleSelectionModal.js
│       │   │   │   │   ├── RoleSubGroup.js
│       │   │   │   │   ├── RoleTable.js
│       │   │   │   │   ├── RoleTableHeader.js
│       │   │   │   │   ├── style.module.css
│       │   │   │   │   └── UserRoles.js
│       │   │   │   ├── UserRolesPage
│       │   │   │   │   ├── style.module.css
│       │   │   │   │   └── UserRolesPage.js
│       │   │   │   └── UserTable
│       │   │   │       ├── EditUserModal.js
│       │   │   │       ├── style.module.css
│       │   │   │       └── UserTable.js
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── IusPt.js
│       │   │   │   ├── IusPtUser.js
│       │   │   │   ├── IusSprav.js
│       │   │   │   ├── IusUserApplication.js
│       │   │   │   └── style.module.css
│       │   │   ├── routes.js
│       │   │   ├── services
│       │   │   │   └── IusPtService.js
│       │   │   └── store
│       │   │       └── IusPtStore.js
│       │   ├── json
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── json.js
│       │   │   │   └── style.module.css
│       │   │   └── routes.js
│       │   ├── notes
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── CreatePost.js
│       │   │   │   ├── EditPost.js
│       │   │   │   ├── Notes.css
│       │   │   │   └── Notes.js
│       │   │   ├── routes.js
│       │   │   └── services
│       │   │       └── NoteService.js
│       │   ├── prints
│       │   │   ├── components
│       │   │   │   ├── PrintAll.js
│       │   │   │   ├── PrintChart.js
│       │   │   │   ├── PrintCreateModal.js
│       │   │   │   ├── PrintEditModal.js
│       │   │   │   ├── PrinteEditLocationModal.js
│       │   │   │   ├── PrintLocation.js
│       │   │   │   ├── PrintModel.js
│       │   │   │   └── PrintModelCreateModal.js
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── Prints.css
│       │   │   │   └── Prints.js
│       │   │   └── services
│       │   │       └── PrintsService.js
│       │   └── staff
│       │       ├── index.js
│       │       ├── pages
│       │       │   ├── Staff.css
│       │       │   ├── Staff.js
│       │       │   ├── StaffCreateModal.js
│       │       │   ├── StaffEditModal.js
│       │       │   ├── StaffImportModal.js
│       │       │   ├── StaffSprav.js
│       │       │   ├── StaffSpravDepartments.js
│       │       │   └── style.module.css
│       │       ├── routes.js
│       │       ├── services
│       │       │   └── StaffService.js
│       │       └── store
│       │           └── UserStore.js
│       ├── Image
│       │   ├── 13506.750.jpg
│       │   ├── christmas-plains.png
│       │   ├── ib.jpg
│       │   ├── Landscaping-Logo.png
│       │   ├── plug1.jpg
│       │   ├── plug2.jpg
│       │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│       │   ├── UI.jpg
│       │   └── wordpress_web_security_header.jpg
│       ├── index.js
│       └── shared
│           └── PrivateRoute.js
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
├── .gitignore
├── client
│   ├── .env.development
│   ├── .env.production
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── src
│       ├── App.css
│       ├── App.js
│       ├── Components
│       │   ├── button
│       │   │   ├── buttonLogout.js
│       │   │   └── style.module.css
│       │   ├── circle
│       │   │   ├── Circle.js
│       │   │   └── Circle.module.css
│       │   ├── Clock.js
│       │   ├── NavBar
│       │   │   ├── NavBar.css
│       │   │   └── NavBar.js
│       │   └── Table
│       │       ├── style.module.css
│       │       └── Table.js
│       ├── features
│       │   ├── admin
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── Admin.css
│       │   │   │   ├── Admin.js
│       │   │   │   ├── AdminCreate.js
│       │   │   │   ├── AdminEditUser.js
│       │   │   │   ├── LoginPage.js
│       │   │   │   ├── PrivateRoute.js
│       │   │   │   └── RoleSprav.js
│       │   │   ├── routes.js
│       │   │   ├── services
│       │   │   │   └── AdminService.js
│       │   │   └── store
│       │   │       └── UserStore.js
│       │   ├── ib
│       │   │   ├── components
│       │   │   │   └── image
│       │   │   │       └── i.jpg
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── ib.js
│       │   │   │   ├── instructions.js
│       │   │   │   └── style.module.css
│       │   │   └── routes.js
│       │   ├── ip
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── ipaddress.js
│       │   │   │   └── style.module.css
│       │   │   ├── routes.js
│       │   │   ├── services
│       │   │   │   └── IpService.js
│       │   │   └── store
│       │   │       └── IpStore.js
│       │   ├── ius-pt
│       │   │   ├── components
│       │   │   │   ├── ButtonAll
│       │   │   │   │   ├── ButtonAll.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── IusAdm
│       │   │   │   │   └── IusAdm.js
│       │   │   │   ├── SearchInput
│       │   │   │   │   ├── SearchInput.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── SpravRole
│       │   │   │   │   ├── AddRoleModal.js
│       │   │   │   │   ├── SpravRole.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── StopRoles
│       │   │   │   │   ├── StopRoles.js
│       │   │   │   │   └── style.module.css
│       │   │   │   ├── UserRoles
│       │   │   │   │   ├── AddOverRoleModal.js
│       │   │   │   │   ├── RoleGroup.js
│       │   │   │   │   ├── RoleRow.js
│       │   │   │   │   ├── RoleSelectionModal.js
│       │   │   │   │   ├── RoleSubGroup.js
│       │   │   │   │   ├── RoleTable.js
│       │   │   │   │   ├── RoleTableHeader.js
│       │   │   │   │   ├── style.module.css
│       │   │   │   │   └── UserRoles.js
│       │   │   │   ├── UserRolesPage
│       │   │   │   │   ├── style.module.css
│       │   │   │   │   └── UserRolesPage.js
│       │   │   │   └── UserTable
│       │   │   │       ├── EditUserModal.js
│       │   │   │       ├── style.module.css
│       │   │   │       └── UserTable.js
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── IusPt.js
│       │   │   │   ├── IusPtUser.js
│       │   │   │   ├── IusSprav.js
│       │   │   │   ├── IusUserApplication.js
│       │   │   │   └── style.module.css
│       │   │   ├── routes.js
│       │   │   ├── services
│       │   │   │   └── IusPtService.js
│       │   │   └── store
│       │   │       └── IusPtStore.js
│       │   ├── json
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── json.js
│       │   │   │   └── style.module.css
│       │   │   └── routes.js
│       │   ├── notes
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── CreatePost.js
│       │   │   │   ├── EditPost.js
│       │   │   │   ├── Notes.css
│       │   │   │   └── Notes.js
│       │   │   ├── routes.js
│       │   │   └── services
│       │   │       └── NoteService.js
│       │   ├── prints
│       │   │   ├── components
│       │   │   │   ├── PrintAll.js
│       │   │   │   ├── PrintChart.js
│       │   │   │   ├── PrintCreateModal.js
│       │   │   │   ├── PrintEditModal.js
│       │   │   │   ├── PrinteEditLocationModal.js
│       │   │   │   ├── PrintLocation.js
│       │   │   │   ├── PrintModel.js
│       │   │   │   └── PrintModelCreateModal.js
│       │   │   ├── index.js
│       │   │   ├── pages
│       │   │   │   ├── Prints.css
│       │   │   │   └── Prints.js
│       │   │   └── services
│       │   │       └── PrintsService.js
│       │   └── staff
│       │       ├── index.js
│       │       ├── pages
│       │       │   ├── Staff.css
│       │       │   ├── Staff.js
│       │       │   ├── StaffCreateModal.js
│       │       │   ├── StaffEditModal.js
│       │       │   ├── StaffImportModal.js
│       │       │   ├── StaffSprav.js
│       │       │   ├── StaffSpravDepartments.js
│       │       │   └── style.module.css
│       │       ├── routes.js
│       │       ├── services
│       │       │   └── StaffService.js
│       │       └── store
│       │           └── UserStore.js
│       ├── Image
│       │   ├── 13506.750.jpg
│       │   ├── christmas-plains.png
│       │   ├── ib.jpg
│       │   ├── Landscaping-Logo.png
│       │   ├── plug1.jpg
│       │   ├── plug2.jpg
│       │   ├── ricoh-aficio-mp-2352sp-litera-l-ru-900x700.jpg
│       │   ├── UI.jpg
│       │   └── wordpress_web_security_header.jpg
│       ├── index.js
│       └── shared
│           └── PrivateRoute.js
├── server
│   ├── .env
│   ├── config
│   │   └── config.json
│   ├── controllers
│   │   ├── DepartmentController.js
│   │   ├── ipControllers.js
│   │   ├── IusControllers
│   │   │   ├── IusSpravAdmController.js
│   │   │   ├── IusSpravRolesController.js
│   │   │   ├── IusStopRolesConroller.js
│   │   │   ├── IusUserController.js
│   │   │   ├── IusUserRolesController.js
│   │   │   └── StaffController.js
│   │   ├── NoteController.js
│   │   ├── PrintController.js
│   │   ├── PrintModelController.js
│   │   ├── StaffControllers.js
│   │   └── UserControllers.js
│   ├── db.js
│   ├── error
│   │   └── ApiError.js
│   ├── migrations
│   │   └── 20250505064536-add_new_field_to_prints.js
│   ├── models
│   │   ├── IusPtModels.js
│   │   └── models.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   ├── index.js
│   │   ├── ipaddressRouter.js
│   │   ├── iusRouter.js
│   │   ├── notesRouter.js
│   │   ├── printModelsRouter.js
│   │   ├── printRouter.js
│   │   ├── staffRouter.js
│   │   └── userRouter.js
│   ├── server.js
│   ├── snmpPoller.js
│   └── static
│       ├── 062a179d-50be-4705-9778-ea18f6b769f9.jpg
│       ├── 0f6c4ac4-cf78-4095-9e16-5f8ee11bdcd1.jpg
│       ├── 25fcccb5-1620-436e-bbe6-6e5cdeef2ea7.jpg
│       ├── 32f97995-ea15-4d7d-a89b-63db12c7ce89.jpg
│       ├── 34125a1e-1177-4e05-85cf-cec9b5d208df.jpg
│       ├── 4f02e10b-e9ec-4579-a339-20e1ab514518.jpg
│       ├── 4f87b3ac-e65d-4d65-9838-951e581e4182.jpg
│       ├── 566eead2-17e2-47da-b4ab-cfd96edb1575.jpg
│       ├── 6666c0fd-78b3-439d-8123-51a5c0dae5b5.jpg
│       ├── 732ef625-7b04-46cc-8b6f-49dc878b49b6.jpg
│       ├── 75179825-d480-46c6-b2b8-3bbb5dc609a3.jpg
│       ├── 7b421859-70bd-430c-a7fb-1f3c50144070.jpg
│       ├── 825c5a2f-ceca-4581-9c04-cc8a3741090b.jpg
│       ├── 8945a1ef-f66c-46fc-94ea-2505d6a8b4ae.jpg
│       ├── 8d513957-7e9d-463f-8f59-3b9bc66a20b8.jpg
│       ├── 8ec4ede6-4c40-4367-8880-f646fedc670f.jpg
│       ├── 9ec06414-df3b-4ea5-b5e9-40f7507f02f8.jpg
│       ├── b71d4b3b-f904-4418-af65-1c08e0c93ad9.jpg
│       ├── ba86ccf8-387a-4375-86ca-b1eacbfb41ed.jpg
│       ├── bd11f121-7717-48c0-8d65-b5470010ee81.jpg
│       ├── bdbfd3a1-7ffe-4cf5-9d8d-0435539b9f88.jpg
│       ├── c7424999-2f2f-4923-8d41-3b8356156038.jpg
│       ├── cb9d36a3-4d99-43f7-ab6e-9bd398b3a212.jpg
│       ├── cbbdf12b-c614-4331-9c48-de7eb9f85578.jpg
│       ├── e2a3e24e-367b-43a5-9aff-5ad42da58fb2.jpg
│       ├── e35b341f-c8dd-4da7-afe8-d31fe4c4106f.jpg
│       ├── e530363a-ba2b-4615-a874-9fc7f5afd5a8.jpg
│       ├── ed7f22a7-aea8-4e9e-bd77-8a431843cecb.jpg
│       └── f23bad18-0f20-4ac5-af9f-141af81e39ad.jpg
└── Tree.md
