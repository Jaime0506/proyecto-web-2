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
    { name: "Convocatoria", path: "applicant/convocatorias/active" },
    
];

export const LIST_HREFS_EVALUATOR: IRouteObject[] = [
    { name: "Dashboard", path: "/evaluator" },
    { name: "Crear convocatorias", path: "/evaluator/scholarship-calls" },
    { name: "Postulantes", path: "/evaluator/applications" },
];

