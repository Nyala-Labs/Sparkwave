import { os } from "@/data/os";
import { db } from "@/db/drizzle";
import { statusApprovalDepartments } from "@/db/schema/events";
import { eq } from "drizzle-orm";

export const GetPeopleApprovalList = os.events.getPeople
  .handler(async ({ input }) => {
    const departmentsForApproval =
      await db.query.statusApprovalDepartments.findMany({
        where: eq(statusApprovalDepartments.statusId, input.statusId),
        with: {
          department: {
            with: {
              userDepartments: {
                with: {
                  user: true,
                },
              },
            },
          },
        },
      });
    const users = departmentsForApproval.flatMap(
      (item) => item.department?.userDepartments.map((ud) => ud.user) ?? [],
    );

    const uniqueUsers = Array.from(
      new Map(
        users.map((user) => [
          user.id,
          {
            id: user.id,
            email: user.email,
            name: user.name,
            profile: user.profile,
          },
        ]),
      ).values(),
    );
    console.log("Unique users for approval:", uniqueUsers);
    return uniqueUsers;
  })
  .callable();
