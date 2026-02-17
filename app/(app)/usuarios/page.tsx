import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserForm } from "@/components/users/UserForm";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { parsePagination } from "@/lib/helpers";
import Link from "next/link";

type UsersPageProps = {
  searchParams?: {
    q?: string;
    role?: string;
    page?: string;
    pageSize?: string;
  };
};

function buildQuery(params: Record<string, string | undefined>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      qs.set(key, value);
    }
  });
  const query = qs.toString();
  return query ? `?${query}` : "";
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const q = searchParams?.q?.trim() || "";
  const roleFilter =
    searchParams?.role === "ADMIN" || searchParams?.role === "USER"
      ? (searchParams.role as Role)
      : undefined;

  const { page: rawPage, pageSize } = parsePagination({
    page: searchParams?.page,
    pageSize: searchParams?.pageSize
  });

  const where = {
    ...(roleFilter ? { role: roleFilter } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } }
          ]
        }
      : {})
  };

  const total = await prisma.user.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, rawPage), totalPages);

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize
  });

  const baseQuery = {
    q: q || undefined,
    role: roleFilter,
    pageSize: String(pageSize)
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Usuarios</h1>
        <p className="text-sm text-slate-500">Crie novos usuarios e defina cargos.</p>
      </div>
      <UserForm />
      <div className="card">
        <h2 className="text-lg font-semibold">Filtros</h2>
        <form className="mt-4 grid gap-3 md:grid-cols-4" method="get">
          <input
            className="input"
            name="q"
            placeholder="Buscar por nome ou email"
            defaultValue={q}
          />
          <select className="input" name="role" defaultValue={roleFilter}>
            <option value="">Todos os cargos</option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>
          <select className="input" name="pageSize" defaultValue={String(pageSize)}>
            <option value="5">5 por pagina</option>
            <option value="10">10 por pagina</option>
            <option value="20">20 por pagina</option>
            <option value="50">50 por pagina</option>
          </select>
          <button className="btn-primary" type="submit">
            Aplicar
          </button>
        </form>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold">Lista de usuarios</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-2">Nome</th>
                <th className="py-2">Email</th>
                <th className="py-2">Cargo</th>
                <th className="py-2">Criado em</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td className="py-3 text-slate-500" colSpan={4}>
                    Nenhum usuario cadastrado.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t border-slate-100">
                    <td className="py-2 font-medium">{user.name || "-"}</td>
                    <td className="py-2">{user.email}</td>
                    <td className="py-2">{user.role}</td>
                    <td className="py-2">
                      {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Pagina {page} de {totalPages} ({total} usuarios)
          </span>
          <div className="flex items-center gap-2">
            <Link
              className={`btn-secondary ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
              href={`/usuarios${buildQuery({ ...baseQuery, page: String(page - 1) })}`}
            >
              Anterior
            </Link>
            <Link
              className={`btn-secondary ${
                page >= totalPages ? "pointer-events-none opacity-50" : ""
              }`}
              href={`/usuarios${buildQuery({ ...baseQuery, page: String(page + 1) })}`}
            >
              Proxima
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


