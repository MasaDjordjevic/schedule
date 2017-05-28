using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Server.Models
{
    public partial class RasporedContext : DbContext
    {
        public virtual DbSet<Activities> Activities { get; set; }
        public virtual DbSet<ActivitySchedules> ActivitySchedules { get; set; }
        public virtual DbSet<Ads> Ads { get; set; }
        public virtual DbSet<AssistantsCourses> AssistantsCourses { get; set; }
        public virtual DbSet<Classrooms> Classrooms { get; set; }
        public virtual DbSet<Courses> Courses { get; set; }
        public virtual DbSet<Departments> Departments { get; set; }
        public virtual DbSet<DivisionTypes> DivisionTypes { get; set; }
        public virtual DbSet<Divisions> Divisions { get; set; }
        public virtual DbSet<Groups> Groups { get; set; }
        public virtual DbSet<GroupsStudents> GroupsStudents { get; set; }
        public virtual DbSet<Periods> Periods { get; set; }
        public virtual DbSet<Permissions> Permissions { get; set; }
        public virtual DbSet<Roles> Roles { get; set; }
        public virtual DbSet<RolesPermissions> RolesPermissions { get; set; }
        public virtual DbSet<Students> Students { get; set; }
        public virtual DbSet<StudentsActivities> StudentsActivities { get; set; }
        public virtual DbSet<StudentsCourses> StudentsCourses { get; set; }
        public virtual DbSet<TimeSpans> TimeSpans { get; set; }
        public virtual DbSet<UniMembers> UniMembers { get; set; }
        public virtual DbSet<UniMembersRoles> UniMembersRoles { get; set; }

        public RasporedContext(DbContextOptions<RasporedContext> options) : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Activities>(entity =>
            {
                entity.HasKey(e => e.ActivityId)
                    .HasName("PK_Activities");

                entity.Property(e => e.ActivityId).HasColumnName("activityID");

                entity.Property(e => e.ActivityContent)
                    .HasColumnName("activityContent")
                    .HasMaxLength(2000);

                entity.Property(e => e.ActivityScheduleId).HasColumnName("activityScheduleID");

                entity.Property(e => e.AssistantId).HasColumnName("assistantID");

                entity.Property(e => e.Cancelling).HasColumnName("cancelling");

                entity.Property(e => e.ClassroomId).HasColumnName("classroomID");

                entity.Property(e => e.CourseId).HasColumnName("courseID");

                entity.Property(e => e.GroupId).HasColumnName("groupID");

                entity.Property(e => e.Place)
                    .HasColumnName("place")
                    .HasMaxLength(50);

                entity.Property(e => e.TimeSpanId).HasColumnName("timeSpanID");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasColumnName("title")
                    .HasMaxLength(50);

                entity.HasOne(d => d.ActivitySchedule)
                    .WithMany(p => p.Activities)
                    .HasForeignKey(d => d.ActivityScheduleId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_Activities_ActivitySchedules");

                entity.HasOne(d => d.Assistant)
                    .WithMany(p => p.Activities)
                    .HasForeignKey(d => d.AssistantId)
                    .HasConstraintName("FK_Activities_UniMembers");

                entity.HasOne(d => d.Classroom)
                    .WithMany(p => p.Activities)
                    .HasForeignKey(d => d.ClassroomId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("FK_Activities_Classrooms");

                entity.HasOne(d => d.Course)
                    .WithMany(p => p.Activities)
                    .HasForeignKey(d => d.CourseId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_Activities_Courses");

                entity.HasOne(d => d.Group)
                    .WithMany(p => p.Activities)
                    .HasForeignKey(d => d.GroupId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_Activities_Groups");

                entity.HasOne(d => d.TimeSpan)
                    .WithMany(p => p.Activities)
                    .HasForeignKey(d => d.TimeSpanId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Activities_TimeSpans");
            });

            modelBuilder.Entity<ActivitySchedules>(entity =>
            {
                entity.HasKey(e => e.ActivityScheduleId)
                    .HasName("PK_RasporedAktivnosti");

                entity.Property(e => e.ActivityScheduleId).HasColumnName("activityScheduleID");

                entity.Property(e => e.Beginning)
                    .HasColumnName("beginning")
                    .HasColumnType("date");

                entity.Property(e => e.Ending)
                    .HasColumnName("ending")
                    .HasColumnType("date");

                entity.Property(e => e.Link)
                    .HasColumnName("link")
                    .HasMaxLength(200);

                entity.Property(e => e.Semester)
                    .IsRequired()
                    .HasColumnName("semester")
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Ads>(entity =>
            {
                entity.HasKey(e => e.AdId)
                    .HasName("PK_Oglas");

                entity.Property(e => e.AdId).HasColumnName("adID");

                entity.Property(e => e.GroupId).HasColumnName("groupID");

                entity.Property(e => e.StudentId).HasColumnName("studentID");

                entity.HasOne(d => d.Group)
                    .WithMany(p => p.Ads)
                    .HasForeignKey(d => d.GroupId)
                    .HasConstraintName("FK_Ads_Groups");

                entity.HasOne(d => d.Student)
                    .WithMany(p => p.Ads)
                    .HasForeignKey(d => d.StudentId)
                    .HasConstraintName("FK_Oglas_Student");
            });

            modelBuilder.Entity<AssistantsCourses>(entity =>
            {
                entity.HasKey(e => e.AssistantCourseId)
                    .HasName("PK_AssistantsCourses");

                entity.Property(e => e.AssistantCourseId).HasColumnName("assistantCourseID");

                entity.Property(e => e.AssistantId).HasColumnName("assistantID");

                entity.Property(e => e.ClassType)
                    .HasColumnName("classType")
                    .HasMaxLength(50);

                entity.Property(e => e.CourseId).HasColumnName("courseID");

                entity.HasOne(d => d.Assistant)
                    .WithMany(p => p.AssistantsCourses)
                    .HasForeignKey(d => d.AssistantId)
                    .HasConstraintName("FK_AssistantsCourses_UniMembers");

                entity.HasOne(d => d.Course)
                    .WithMany(p => p.AssistantsCourses)
                    .HasForeignKey(d => d.CourseId)
                    .HasConstraintName("FK_AssistantsCourses_Courses");
            });

            modelBuilder.Entity<Classrooms>(entity =>
            {
                entity.HasKey(e => e.ClassroomId)
                    .HasName("PK_Ucionica");

                entity.Property(e => e.ClassroomId).HasColumnName("classroomID");

                entity.Property(e => e.Cs).HasColumnName("cs");

                entity.Property(e => e.Number)
                    .IsRequired()
                    .HasColumnName("number")
                    .HasMaxLength(50);

                entity.Property(e => e.Projector).HasColumnName("projector");

                entity.Property(e => e.SunnySide).HasColumnName("sunnySide");
            });

            modelBuilder.Entity<Courses>(entity =>
            {
                entity.HasKey(e => e.CourseId)
                    .HasName("PK_Predmet");

                entity.Property(e => e.CourseId).HasColumnName("courseID");

                entity.Property(e => e.Alias)
                    .IsRequired()
                    .HasColumnName("alias")
                    .HasMaxLength(50);

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnName("code")
                    .HasMaxLength(50);

                entity.Property(e => e.DepartmentId).HasColumnName("departmentID");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(50);

                entity.Property(e => e.Obavezni).HasColumnName("obavezni");

                entity.Property(e => e.Semester).HasColumnName("semester");

                entity.HasOne(d => d.Department)
                    .WithMany(p => p.Courses)
                    .HasForeignKey(d => d.DepartmentId)
                    .HasConstraintName("FK_Courses_Departments");
            });

            modelBuilder.Entity<Departments>(entity =>
            {
                entity.HasKey(e => e.DepartmentId)
                    .HasName("PK_Smer");

                entity.Property(e => e.DepartmentId).HasColumnName("departmentID");

                entity.Property(e => e.DepartmentName)
                    .IsRequired()
                    .HasColumnName("departmentName")
                    .HasMaxLength(50);

                entity.Property(e => e.Year).HasColumnName("year");
            });

            modelBuilder.Entity<DivisionTypes>(entity =>
            {
                entity.HasKey(e => e.DivisionTypeId)
                    .HasName("PK_TipRaspodele");

                entity.Property(e => e.DivisionTypeId).HasColumnName("divisionTypeID");

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasColumnName("type")
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Divisions>(entity =>
            {
                entity.HasKey(e => e.DivisionId)
                    .HasName("PK_Raspodela");

                entity.Property(e => e.DivisionId).HasColumnName("divisionID");

                entity.Property(e => e.Beginning)
                    .HasColumnName("beginning")
                    .HasColumnType("date");

                entity.Property(e => e.CourseId).HasColumnName("courseID");

                entity.Property(e => e.CreatorId).HasColumnName("creatorID");

                entity.Property(e => e.DepartmentId).HasColumnName("departmentID");

                entity.Property(e => e.DivisionTypeId).HasColumnName("divisionTypeID");

                entity.Property(e => e.Ending)
                    .HasColumnName("ending")
                    .HasColumnType("date");

                entity.Property(e => e.Name)
                    .HasColumnName("name")
                    .HasMaxLength(50);

                entity.HasOne(d => d.Course)
                    .WithMany(p => p.Divisions)
                    .HasForeignKey(d => d.CourseId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_Divisions_Courses");

                entity.HasOne(d => d.Creator)
                    .WithMany(p => p.Divisions)
                    .HasForeignKey(d => d.CreatorId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Divisions_UniMembers");

                entity.HasOne(d => d.Department)
                    .WithMany(p => p.Divisions)
                    .HasForeignKey(d => d.DepartmentId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_Divisions_Departments");

                entity.HasOne(d => d.DivisionType)
                    .WithMany(p => p.Divisions)
                    .HasForeignKey(d => d.DivisionTypeId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Raspodela_TipRaspodele");
            });

            modelBuilder.Entity<Groups>(entity =>
            {
                entity.HasKey(e => e.GroupId)
                    .HasName("PK_Grupa");

                entity.Property(e => e.GroupId).HasColumnName("groupID");

                entity.Property(e => e.AssistantId).HasColumnName("assistantID");

                entity.Property(e => e.ClassroomId).HasColumnName("classroomID");

                entity.Property(e => e.DivisionId).HasColumnName("divisionID");

                entity.Property(e => e.Name)
                    .HasColumnName("name")
                    .HasMaxLength(50);

                entity.Property(e => e.TimeSpanId).HasColumnName("timeSpanID");

                entity.HasOne(d => d.Assistant)
                    .WithMany(p => p.Groups)
                    .HasForeignKey(d => d.AssistantId)
                    .HasConstraintName("FK_Groups_UniMembers");

                entity.HasOne(d => d.Classroom)
                    .WithMany(p => p.Groups)
                    .HasForeignKey(d => d.ClassroomId)
                    .HasConstraintName("FK_Grupa_Ucionica");

                entity.HasOne(d => d.Division)
                    .WithMany(p => p.Groups)
                    .HasForeignKey(d => d.DivisionId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Grupa_Raspodela");

                entity.HasOne(d => d.TimeSpan)
                    .WithMany(p => p.Groups)
                    .HasForeignKey(d => d.TimeSpanId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("FK_Groups_TimeSpans");
            });

            modelBuilder.Entity<GroupsStudents>(entity =>
            {
                entity.HasKey(e => e.GroupsStudentId)
                    .HasName("PK_GrupaStudent");

                entity.Property(e => e.GroupsStudentId).HasColumnName("groupsStudentID");

                entity.Property(e => e.Alert).HasColumnName("alert");

                entity.Property(e => e.FalseMember)
                    .HasColumnName("falseMember")
                    .HasDefaultValueSql("0");

                entity.Property(e => e.GroupId).HasColumnName("groupID");

                entity.Property(e => e.Ignore).HasColumnName("ignore");

                entity.Property(e => e.StudentId).HasColumnName("studentID");

                entity.HasOne(d => d.Group)
                    .WithMany(p => p.GroupsStudents)
                    .HasForeignKey(d => d.GroupId)
                    .HasConstraintName("FK_GrupaStudent_Grupa");

                entity.HasOne(d => d.Student)
                    .WithMany(p => p.GroupsStudents)
                    .HasForeignKey(d => d.StudentId)
                    .HasConstraintName("FK_GrupaStudent_Student");
            });

            modelBuilder.Entity<Periods>(entity =>
            {
                entity.HasKey(e => e.PeriodId)
                    .HasName("PK_ZeljeniTermin");

                entity.Property(e => e.PeriodId).HasColumnName("periodID");

                entity.Property(e => e.AdId).HasColumnName("adID");

                entity.Property(e => e.GroupId).HasColumnName("groupID");

                entity.HasOne(d => d.Ad)
                    .WithMany(p => p.Periods)
                    .HasForeignKey(d => d.AdId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_ZeljeniTermin_Oglas");

                entity.HasOne(d => d.Group)
                    .WithMany(p => p.Periods)
                    .HasForeignKey(d => d.GroupId)
                    .HasConstraintName("FK_ZeljeniTermin_Grupa");
            });

            modelBuilder.Entity<Permissions>(entity =>
            {
                entity.HasKey(e => e.PermissionId)
                    .HasName("PK_Permisija");

                entity.Property(e => e.PermissionId).HasColumnName("permissionID");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Roles>(entity =>
            {
                entity.HasKey(e => e.RoleId)
                    .HasName("PK_Rola");

                entity.Property(e => e.RoleId).HasColumnName("roleID");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<RolesPermissions>(entity =>
            {
                entity.HasKey(e => e.RolesPermissionId)
                    .HasName("PK_RolaPermisija");

                entity.Property(e => e.RolesPermissionId).HasColumnName("rolesPermissionID");

                entity.Property(e => e.PermissionId).HasColumnName("permissionID");

                entity.Property(e => e.RoleId).HasColumnName("roleID");

                entity.HasOne(d => d.Permission)
                    .WithMany(p => p.RolesPermissions)
                    .HasForeignKey(d => d.PermissionId)
                    .HasConstraintName("FK_RolaPermisija_Permisija");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.RolesPermissions)
                    .HasForeignKey(d => d.RoleId)
                    .HasConstraintName("FK_RolaPermisija_Rola");
            });

            modelBuilder.Entity<Students>(entity =>
            {
                entity.HasKey(e => e.StudentId)
                    .HasName("PK_Student");

                entity.HasIndex(e => e.IndexNumber)
                    .HasName("Index_unique")
                    .IsUnique();

                entity.Property(e => e.StudentId).HasColumnName("studentID");

                entity.Property(e => e.DepartmentId).HasColumnName("departmentID");

                entity.Property(e => e.IndexNumber).HasColumnName("indexNumber");

                entity.HasOne(d => d.Department)
                    .WithMany(p => p.Students)
                    .HasForeignKey(d => d.DepartmentId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Student_Smer");
            });

            modelBuilder.Entity<StudentsActivities>(entity =>
            {
                entity.HasKey(e => e.StudentActivityId)
                    .HasName("PK_StudentsActivities");

                entity.Property(e => e.StudentActivityId).HasColumnName("studentActivityID");

                entity.Property(e => e.ActivityId).HasColumnName("activityID");

                entity.Property(e => e.Alert).HasColumnName("alert");

                entity.Property(e => e.Ignore).HasColumnName("ignore");

                entity.Property(e => e.StudentId).HasColumnName("studentID");

                entity.HasOne(d => d.Activity)
                    .WithMany(p => p.StudentsActivities)
                    .HasForeignKey(d => d.ActivityId)
                    .HasConstraintName("FK_StudentsActivities_Activities");

                entity.HasOne(d => d.Student)
                    .WithMany(p => p.StudentsActivities)
                    .HasForeignKey(d => d.StudentId)
                    .HasConstraintName("FK_StudentsActivities_Students");
            });

            modelBuilder.Entity<StudentsCourses>(entity =>
            {
                entity.HasKey(e => e.StudentsCourseId)
                    .HasName("PK_StudentsCourses");

                entity.Property(e => e.StudentsCourseId).HasColumnName("studentsCourseID");

                entity.Property(e => e.CourseId).HasColumnName("courseID");

                entity.Property(e => e.StudentId).HasColumnName("studentID");

                entity.HasOne(d => d.Course)
                    .WithMany(p => p.StudentsCourses)
                    .HasForeignKey(d => d.CourseId)
                    .HasConstraintName("FK_StudentsCourses_Courses");

                entity.HasOne(d => d.Student)
                    .WithMany(p => p.StudentsCourses)
                    .HasForeignKey(d => d.StudentId)
                    .HasConstraintName("FK_StudentsCourses_Students");
            });

            modelBuilder.Entity<TimeSpans>(entity =>
            {
                entity.HasKey(e => e.TimeSpanId)
                    .HasName("PK_TimeSpans");

                entity.Property(e => e.TimeSpanId).HasColumnName("timeSpanID");

                entity.Property(e => e.EndDate)
                    .HasColumnName("endDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.Period).HasColumnName("period");

                entity.Property(e => e.StartDate)
                    .HasColumnName("startDate")
                    .HasColumnType("datetime");
            });

            modelBuilder.Entity<UniMembers>(entity =>
            {
                entity.HasKey(e => e.UniMemberId)
                    .HasName("PK_ClanFakulteta_1");

                entity.HasIndex(e => e.Username)
                    .HasName("indexUnique")
                    .IsUnique();

                entity.Property(e => e.UniMemberId).HasColumnName("uniMemberID");

                entity.Property(e => e.Address)
                    .HasColumnName("address")
                    .HasMaxLength(200);

                entity.Property(e => e.Avatar)
                    .HasColumnName("avatar")
                    .HasColumnType("image");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasColumnName("email")
                    .HasMaxLength(50);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(50);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasColumnName("password")
                    .HasMaxLength(50);

                entity.Property(e => e.StudentId).HasColumnName("studentID");

                entity.Property(e => e.Surname)
                    .IsRequired()
                    .HasColumnName("surname")
                    .HasMaxLength(50);

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasColumnName("username")
                    .HasMaxLength(50);

                entity.HasOne(d => d.Student)
                    .WithMany(p => p.UniMembers)
                    .HasForeignKey(d => d.StudentId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_ClanFakulteta_Student");
            });

            modelBuilder.Entity<UniMembersRoles>(entity =>
            {
                entity.HasKey(e => e.UniMembersRoleId)
                    .HasName("PK_ClanFakultetaRola");

                entity.Property(e => e.UniMembersRoleId).HasColumnName("uniMembersRoleID");

                entity.Property(e => e.RoleId).HasColumnName("roleID");

                entity.Property(e => e.UniMemberId).HasColumnName("uniMemberID");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.UniMembersRoles)
                    .HasForeignKey(d => d.RoleId)
                    .HasConstraintName("FK_ClanFakultetaRola_Rola");

                entity.HasOne(d => d.UniMember)
                    .WithMany(p => p.UniMembersRoles)
                    .HasForeignKey(d => d.UniMemberId)
                    .HasConstraintName("FK_UniMembersRoles_UniMembers");
            });
        }
    }
}