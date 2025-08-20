using System;
using System.Collections.Generic;

namespace ReactType1.Server.Models;

public partial class OneMatchView
{
    public int Id { get; set; }

    public int Rink { get; set; }

    public string? Team1 { get; set; }

    public string? Team2 { get; set; }

    public string? Wheelchair1 { get; set; }

    public string? Wheelchair2 { get; set; }

    public int Team1Score { get; set; }

    public int Team2Score { get; set; }

    public int ForFeitId { get; set; }

    public int WeekId { get; set; }

    public int Team1No { get; set; }

    public int Team2No { get; set; }

    public DateOnly GameDate { get; set; }

    public int Version { get; set; }
}
