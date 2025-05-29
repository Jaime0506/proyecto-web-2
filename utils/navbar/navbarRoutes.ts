export interface IRouteObject {
    name: string;
    path: string;
}

export const LIST_HREFS_ADMIN: IRouteObject[] = [
    { name: "Administracion de usuarios", path: "/admin/users" },
    { name: "Convocatorias", path: "/admin/scholar-ship" },
];

export const LIST_HREFS_APPLICANT: IRouteObject[] = [
    { name: "", path: "/applicant" },
    { name: "Convocatoria", path: "applicant/convocatorias/active" },
    
];

export const LIST_HREFS_EVALUATOR: IRouteObject[] = [
    { name: "Dashboard", path: "/evaluator" },
    { name: "Crear convocatorias", path: "/evaluator/scholarship-calls" },
    { name: "Postulantes", path: "/evaluator/applications/evaluate" },
    { name: "Evaluar", path: "/evaluator/applications/classify" },

];

