export interface IRouteObject {
    name: string;
    path: string;
}

export const LIST_HREFS_ADMIN: IRouteObject[] = [
    // { name: "Dashboard", path: "/admin/" },
    { name: "Usuarios", path: "/admin/users" },
    // { name: "Settings", path: "/admin/settings" },
];

export const LIST_HREFS_APPLICANT: IRouteObject[] = [
    { name: "", path: "/applicant" },
];

export const LIST_HREFS_EVALUATOR = [
    { name: "Convocatorias", path: "/evaluator/sholarship-calls" },
];
