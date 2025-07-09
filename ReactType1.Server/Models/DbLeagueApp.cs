using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ReactType1.Server.Models;

public partial class DbLeagueApp : DbContext
{
    public DbLeagueApp(DbContextOptions<DbLeagueApp> options)
        : base(options)
    {
    }

    public virtual DbSet<AllTeamsView> AllTeamsViews { get; set; }

    public virtual DbSet<AllTeamsWithNamesView> AllTeamsWithNamesViews { get; set; }

    public virtual DbSet<GetByesView> GetByesViews { get; set; }

    public virtual DbSet<GetMatchAllView> GetMatchAllViews { get; set; }

    public virtual DbSet<GetTeamView> GetTeamViews { get; set; }

    public virtual DbSet<League> Leagues { get; set; }

    public virtual DbSet<Logging> Loggings { get; set; }

    public virtual DbSet<Match> Matches { get; set; }

    public virtual DbSet<MatchScheduleView> MatchScheduleViews { get; set; }

    public virtual DbSet<MatchScoreView> MatchScoreViews { get; set; }

    public virtual DbSet<MatchView> MatchViews { get; set; }

    public virtual DbSet<Membership> Memberships { get; set; }

    public virtual DbSet<OneMatchView> OneMatchViews { get; set; }

    public virtual DbSet<OneMatchWeekView> OneMatchWeekViews { get; set; }

    public virtual DbSet<OneTeamView> OneTeamViews { get; set; }

    public virtual DbSet<Player> Players { get; set; }

    public virtual DbSet<PlayoffGamesView> PlayoffGamesViews { get; set; }

    public virtual DbSet<RecoverPassword> RecoverPasswords { get; set; }

    public virtual DbSet<RinkOrder> RinkOrders { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Schedule> Schedules { get; set; }

    public virtual DbSet<Team> Teams { get; set; }

    public virtual DbSet<TeamMember> TeamMembers { get; set; }

    public virtual DbSet<TeamsView> TeamsViews { get; set; }

    public virtual DbSet<TotalScoreView> TotalScoreViews { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AllTeamsView>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("AllTeamsView");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Lead)
                .HasMaxLength(101)
                .IsUnicode(false);
            entity.Property(e => e.Skip)
                .HasMaxLength(101)
                .IsUnicode(false)
                .HasColumnName("skip");
            entity.Property(e => e.Skipid).HasColumnName("skipid");
            entity.Property(e => e.ViceSkip)
                .HasMaxLength(101)
                .IsUnicode(false);
        });

        modelBuilder.Entity<AllTeamsWithNamesView>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("AllTeamsWithNamesView");

            entity.Property(e => e.TeamMembers)
                .HasMaxLength(154)
                .IsUnicode(false);
        });

        modelBuilder.Entity<GetByesView>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("GetByesView");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Players)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("players");
        });

        modelBuilder.Entity<GetMatchAllView>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("GetMatchAllView");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Lead1)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Lead2)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Skip1)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Skip2)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Vice1)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Vice2)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<GetTeamView>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("GetTeamView");
        });

        modelBuilder.Entity<League>(entity =>
        {
            entity.ToTable("League");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Active).HasDefaultValue(true);
            entity.Property(e => e.ByePoints).HasDefaultValue((short)1);
            entity.Property(e => e.Divisions).HasDefaultValue((short)1);
            entity.Property(e => e.LeagueName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.PointsLimit).HasDefaultValue(true);
            entity.Property(e => e.StartWeek).HasDefaultValue(1);
            entity.Property(e => e.TiePoints).HasDefaultValue((short)1);
            entity.Property(e => e.WinPoints).HasDefaultValue((short)1);
        });

        modelBuilder.Entity<Logging>(entity =>
        {
            entity.ToTable("Logging");

            entity.Property(e => e.TimeStamp).HasColumnType("datetime");
        });

        modelBuilder.Entity<Match>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Schedule");

            entity.ToTable("Match");

            entity.Property(e => e.Id).HasColumnName("id");

            entity.HasOne(d => d.TeamNo1Navigation).WithMany(p => p.MatchTeamNo1Navigations)
                .HasForeignKey(d => d.TeamNo1)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Match_Team");

            entity.HasOne(d => d.TeamNo2Navigation).WithMany(p => p.MatchTeamNo2Navigations)
                .HasForeignKey(d => d.TeamNo2)
                .HasConstraintName("FK_Match_Team1");

            entity.HasOne(d => d.Week).WithMany(p => p.Matches)
                .HasForeignKey(d => d.WeekId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Match_Schedule");
        });

        modelBuilder.Entity<MatchScheduleView>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("MatchScheduleView");

            entity.Property(e => e.Divisionid).HasColumnName("divisionid");
            entity.Property(e => e.Rink).HasColumnName("rink");
            entity.Property(e => e.Team1).HasColumnName("team1");
            entity.Property(e => e.Team2).HasColumnName("team2");
        });

        modelBuilder.Entity<MatchScoreView>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("MatchScoreView");

            entity.Property(e => e.Player1)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("player1");
            entity.Property(e => e.Player2)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("player2");
            entity.Property(e => e.Teamno1).HasColumnName("teamno1");
            entity.Property(e => e.Teamno2).HasColumnName("teamno2");
        });

        modelBuilder.Entity<MatchView>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("MatchView");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Lead1)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Lead2)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Skip1)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Skip2)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Vice1)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Vice2)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Membership>(entity =>
        {
            entity.ToTable("Membership");

            entity.HasIndex(e => new { e.LastName, e.FirstName }, "IX_Membership").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.FullName)
                .HasMaxLength(101)
                .IsUnicode(false)
                .HasComputedColumnSql("(([FirstName]+' ')+[Lastname])", false);
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.NickName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasComputedColumnSql("(case when isnull([shortname],'')='' then [firstname] else [shortname] end)", false);
            entity.Property(e => e.Shortname)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("shortname");
        });

        modelBuilder.Entity<OneMatchView>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("OneMatchView");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Team1)
                .HasMaxLength(154)
                .IsUnicode(false)
                .HasColumnName("team1");
            entity.Property(e => e.Team2)
                .HasMaxLength(154)
                .IsUnicode(false)
                .HasColumnName("team2");
            entity.Property(e => e.Wheelchair1)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("wheelchair1");
            entity.Property(e => e.Wheelchair2)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("wheelchair2");
        });

        modelBuilder.Entity<OneMatchWeekView>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("OneMatchWeekView");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Team1)
                .HasMaxLength(154)
                .IsUnicode(false)
                .HasColumnName("team1");
            entity.Property(e => e.Team2)
                .HasMaxLength(154)
                .IsUnicode(false)
                .HasColumnName("team2");
            entity.Property(e => e.Wheelchair1)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("wheelchair1");
            entity.Property(e => e.Wheelchair2)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("wheelchair2");
        });

        modelBuilder.Entity<OneTeamView>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("OneTeamView");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Lead)
                .HasMaxLength(101)
                .IsUnicode(false);
            entity.Property(e => e.Skip)
                .HasMaxLength(101)
                .IsUnicode(false)
                .HasColumnName("skip");
            entity.Property(e => e.Skipid).HasColumnName("skipid");
            entity.Property(e => e.ViceSkip)
                .HasMaxLength(101)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Player>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Players");

            entity.ToTable("Player");

            entity.HasIndex(e => new { e.MembershipId, e.Leagueid }, "IX_Player").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");

            entity.HasOne(d => d.League).WithMany(p => p.Players)
                .HasForeignKey(d => d.Leagueid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Player__leagueid__4E88ABD4");

            entity.HasOne(d => d.Membership).WithMany(p => p.Players)
                .HasForeignKey(d => d.MembershipId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Player_Membership");
        });

        modelBuilder.Entity<PlayoffGamesView>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("PlayoffGamesView");

            entity.Property(e => e.Id).HasColumnName("id");
        });

        modelBuilder.Entity<RecoverPassword>(entity =>
        {
            entity.ToTable("RecoverPassword");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Time)
                .HasColumnType("datetime")
                .HasColumnName("time");
            entity.Property(e => e.Userid).HasColumnName("userid");
        });

        modelBuilder.Entity<RinkOrder>(entity =>
        {
            entity.ToTable("RinkOrder");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Boundary)
                .HasMaxLength(25)
                .IsUnicode(false);
            entity.Property(e => e.Direction)
                .HasMaxLength(25)
                .IsUnicode(false);
            entity.Property(e => e.Green)
                .HasMaxLength(25)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("Role");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(450)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Schedule>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Schedule_1");

            entity.ToTable("Schedule");

            entity.HasIndex(e => new { e.Leagueid, e.GameDate }, "IX_Schedule_1").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");

            entity.HasOne(d => d.League).WithMany(p => p.Schedules)
                .HasForeignKey(d => d.Leagueid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Schedule__League__4F7CD00D");
        });

        modelBuilder.Entity<Team>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_");

            entity.ToTable("Team");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DivisionId).HasDefaultValue((short)1);

            entity.HasOne(d => d.LeadNavigation).WithMany(p => p.TeamLeadNavigations)
                .HasForeignKey(d => d.Lead)
                .HasConstraintName("FK__Players2");

            entity.HasOne(d => d.League).WithMany(p => p.Teams)
                .HasForeignKey(d => d.Leagueid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Team__leagueid__4D94879B");

            entity.HasOne(d => d.SkipNavigation).WithMany(p => p.TeamSkipNavigations)
                .HasForeignKey(d => d.Skip)
                .HasConstraintName("FK__Players");

            entity.HasOne(d => d.ViceSkipNavigation).WithMany(p => p.TeamViceSkipNavigations)
                .HasForeignKey(d => d.ViceSkip)
                .HasConstraintName("FK__Players1");
        });

        modelBuilder.Entity<TeamMember>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("TeamMembers");

            entity.Property(e => e.Cnt).HasColumnName("cnt");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Lead)
                .HasMaxLength(101)
                .IsUnicode(false);
            entity.Property(e => e.Skip)
                .HasMaxLength(101)
                .IsUnicode(false)
                .HasColumnName("skip");
            entity.Property(e => e.ViceSkip)
                .HasMaxLength(101)
                .IsUnicode(false);
        });

        modelBuilder.Entity<TeamsView>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("TeamsView");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Lead)
                .HasMaxLength(101)
                .IsUnicode(false);
            entity.Property(e => e.Skip)
                .HasMaxLength(101)
                .IsUnicode(false);
            entity.Property(e => e.ViceSkip)
                .HasMaxLength(101)
                .IsUnicode(false);
        });

        modelBuilder.Entity<TotalScoreView>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("TotalScoreView");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Total).HasColumnName("total");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("User");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DisplayName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Password)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.RoleId).HasDefaultValue(1);
            entity.Property(e => e.SerialNumber)
                .HasMaxLength(450)
                .IsUnicode(false);
            entity.Property(e => e.Username)
                .HasMaxLength(450)
                .IsUnicode(false);

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_User_Role");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
