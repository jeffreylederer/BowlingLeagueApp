using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using ReactType1.Server.Models;
using System.Numerics;
using System.Security.Policy;
using System.Text.RegularExpressions;

namespace ReactType1.Server.Code
{
    public class ScheduleReport
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="id">leagueid</param>
        /// <param name="db">context</param>
        public async Task<IDocument> CreateDocument(int id, DbLeagueApp db, string site)
        {
            League? league = db.Leagues.Find(id);
            int leagueid = league == null ? 0 : league.Id;
            var schedule = await db.Schedules.Where(x => x.Leagueid == leagueid).OrderBy(x => x.GameDate).ToListAsync();

            List<MatchScheduleView> matches = [.. db.MatchScheduleViews.FromSql($"EXEC MatchSchedule {leagueid}")];

            List<AllTeamsView> teams = [.. db.AllTeamsViews.FromSql($"EXEC AllTeams {leagueid}")];
            

            int rinks = teams.Count / 2;
            int TeamSize = league==null?1 : league.TeamSize;

            return Document.Create(container =>
            {
                container
                .Page(page =>
                {
                    page.Margin(50);

                    page.Header()
                           .AlignCenter()
                           .AlignMiddle()
                           .Column(column =>
                           {
                               column.Item().Text(site).FontSize(16);
                               column.Item().Text(" ");
                               column.Item().Text(league?.LeagueName);

                           });

                    if (!matches.Any())
                    {
                        page.Content().PaddingVertical(20).Column(column =>
                        {
                            column.Item().Inlined(inlined =>
                            {
                                inlined.Spacing(20);
                                inlined.Item().Text("No matches scheduled");
                            });
                        });
                        return;
                    }

                    page.Content().PaddingVertical(20).Column(column =>
                    {


                        column.Item().AlignCenter().Table(table =>
                        {
                            table.Header(header =>
                            {

                                header.Cell().
                                    ColumnSpan((uint)TeamSize + 1)
                                    .AlignCenter()
                                    .AlignMiddle()
                                    .Text("Teams");
                            });

                            table.ColumnsDefinition(columns =>
                            {
                                if(league?.Divisions > 1)
                                    columns.ConstantColumn(40); //division
                                columns.ConstantColumn(40); //team number
                                columns.ConstantColumn(90); //Skip
                                if (TeamSize == 3)
                                    columns.ConstantColumn(90); //ViceSkip
                                if (TeamSize > 1)
                                    columns.ConstantColumn(90); //Lead

                            });

                            static IContainer CellStyle2(IContainer container)
                            {
                                return container.Border(1).BorderColor(Colors.Black).PaddingVertical(5).AlignCenter();
                            }
                            if (league?.Divisions > 1)
                                table.Cell().Element(CellStyle2).Text("Division").SemiBold().FontSize(8);
                            table.Cell().Element(CellStyle2).Text("Team #").SemiBold().FontSize(8);
                            table.Cell().Element(CellStyle2).Text("Skip").SemiBold().FontSize(8);
                            if (TeamSize == 3)
                                table.Cell().Element(CellStyle2).Text("Vice Skip").SemiBold().FontSize(8);
                            if (TeamSize > 1)
                                table.Cell().Element(CellStyle2).Text("Lead").SemiBold().FontSize(8);

                            static IContainer CellStyle(IContainer container)
                            {
                                return container.Border(1).BorderColor(Colors.Black).PaddingVertical(5).AlignCenter();
                            }

                            foreach (var item in teams)
                            {
                                if (league?.Divisions > 1)
                                    table.Cell().Element(CellStyle).Text(item.Division.ToString()).FontSize(8);
                                table.Cell().Element(CellStyle).Text(item.TeamNo.ToString()).FontSize(8);
                                if (item.Skip != null)
                                    table.Cell().Element(CellStyle).Text(item.Skip).FontSize(8);
                                if (item.ViceSkip != null)
                                    table.Cell().Element(CellStyle).Text(item.ViceSkip).FontSize(8);
                                if (item.Lead != null)
                                    table.Cell().Element(CellStyle).Text(item.Lead).FontSize(8);
                            }

                        }); //table 1

                        column.Item().Inlined(inlined =>
                        {
                            inlined.Spacing(20);
                            inlined.Item().Text("");
                        });

                        column.Item().AlignCenter().Table(table =>
                        {
                            table.Header(header =>
                            {

                                header.Cell().
                                    ColumnSpan((uint) rinks+1)
                                    .AlignCenter()
                                    .AlignMiddle()
                                    .Text("Schedule");

                            });

                            table.ColumnsDefinition(columns =>
                            {

                                columns.ConstantColumn(60); //date
                                for (int i = 0; i < rinks; i++)
                                {
                                    columns.ConstantColumn(30); //games
                                }
                            });

                            static IContainer CellStyle2(IContainer container)
                            {
                                return container.Border(1).BorderColor(Colors.Black).PaddingVertical(5).AlignCenter();
                            }

                            
                            table.Cell().Element(CellStyle2).Text("Date").SemiBold().FontSize(8);

                            for (int i = 0; i < rinks; i++)
                            {
                                table.Cell().Element(CellStyle2).Text((i + 1).ToString()).SemiBold().FontSize(8);
                            }

                            static IContainer CellStyle(IContainer container)
                            {
                                return container.Border(1).BorderColor(Colors.Black).PaddingVertical(5).AlignCenter();
                            }

                            
                            foreach(var s in schedule)
                            {
                                if(s.PlayOffs)
                                {
                                    table.Cell().Element(CellStyle).Text(s.GameDate.ToShortDateString()).FontSize(8);
                                    table.Cell().Element(CellStyle).Text("PO").FontSize(8);
                                    for (int r = 0; r < rinks - 1; r++)
                                    {
                                        table.Cell().Element(CellStyle).Text("*").FontSize(8);

                                    }
                                }
                                else
                                {
                                    var thisweek = matches.Where(x => x.GameDate == s.GameDate).ToList();
                                    table.Cell().Element(CellStyle).Text(s.GameDate.ToShortDateString()).FontSize(8);
                                    for (int r = 0; r < rinks; r++)
                                    {
                                            
                                        var match = $"{thisweek[r].Team1}-{thisweek[r].Team2}";
                                        table.Cell().Element(CellStyle).Text(match).FontSize(8);
                                    }
                                }
                            }

                        }); //table 2
                        if(league.PlayOffs)
                            column.Item().AlignCenter().Inlined(inlined =>
                            {
                                inlined.Item().Text("PO=Playoff Date").FontSize(8);
                            });
                    }); //content
                }); //container
            }); //return
        } //method
    } //class
} //namespace
