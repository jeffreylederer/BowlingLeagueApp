using System;
using System.Collections.Generic;

namespace ReactType1.Server.Models;

public partial class OneTeamView
{
    public int Id { get; set; }

    public string? Skip { get; set; }

    public string? ViceSkip { get; set; }

    public string? Lead { get; set; }

    public int? Skipid { get; set; }

    public int? ViceSkipid { get; set; }

    public int? Leadid { get; set; }

    public int Leagueid { get; set; }

    public short Division { get; set; }

    public int TeamNo { get; set; }
}
