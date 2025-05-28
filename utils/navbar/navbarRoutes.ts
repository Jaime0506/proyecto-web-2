export interface IRouteObject {
    name: string;
    path: string;
}

export const LIST_HREFS_ADMIN: IRouteObject[] = [
    // { name: "Dashboard", path: "/admin/" },
    { name: "Users", path: "/admin/users" },
    // { name: "Settings", path: "/admin/settings" },
];

export const LIST_HREFS_APPLICANT: IRouteObject[] = [
    { name: "", path: "/applicant" },
];

export const LIST_HREFS_EVALUATOR = [
    { name: "Dashboard", path: "/evaluator" },
    { name: "Crear convocatorias", path: "/evaluator/scholarship-calls" },
    { name: "Convocatorias Activas", path: "/convocatorias/active" },
];

