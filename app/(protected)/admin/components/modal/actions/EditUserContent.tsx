import { IUser } from "@/types/auth"

interface EditUserContentProps {
    user: IUser
}

export default function EditUserContent({ user }: EditUserContentProps) {
    return (
        <div>{JSON.stringify(user, null, 2)}</div>
    )
}
