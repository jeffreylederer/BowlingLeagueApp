using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using QuestPDF.Elements;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using ReactType1.Server.Models;
using System.Data.Common;
using static QuestPDF.Helpers.Colors;


namespace ReactType1.Server.Code
{


    public class StandingsReport
    {


        /// <summary>
        /// 
        /// </summary>
        /// <param name="id">weekid</param>
        /// <param name="db">context</param>
        public async Task<IDocument> CreateDocument(int id, DbLeagueApp db, string site)
        {
            Schedule? schedule = await db.Schedules.FindAsync(id);
            League? league = await db.Leagues.FindAsync(schedule?.Leagueid);
            int? TeamSize = league?.TeamSize;
            List<MatchScoreView> matches = db.MatchScoreViews
                     .FromSql($"EXEC MatchScore {id}")
                    .ToList();

            int fontsize = 10;
            if (league?.Divisions == 2)
                fontsize = 8;
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



                    
                    page.Content().PaddingVertical(20).Column(column =>
                    {

                        if (!schedule.PlayOffs)
                        {
                            column.Item().AlignCenter().Table(table =>
                            {

                                table.Header(header =>
                                {

                                    header.Cell().
                                        ColumnSpan(6)
                                        .AlignCenter()
                                        .AlignMiddle()
                                        .Text($"Games for week {schedule?.GameDate.ToShortDateString()}");
                                });


                                table.ColumnsDefinition(columns =>
                                {

                                    columns.ConstantColumn(30); //rink
                                    columns.ConstantColumn(40); //team number
                                    columns.ConstantColumn(120); //players
                                    columns.ConstantColumn(30); //score
                                    columns.ConstantColumn(40); //team number
                                    columns.ConstantColumn(120); //players
                                    columns.ConstantColumn(30); //score
                                    columns.ConstantColumn(50); //forfeiting

                                });

                                static IContainer CellStyle2(IContainer container)
                                {
                                    return container.Border(1).BorderColor(Colors.Black).PaddingVertical(1).AlignCenter();
                                }

                                table.Cell().Element(CellStyle2).Text("Rink").SemiBold().FontSize(fontsize);
                                table.Cell().Element(CellStyle2).Text("Team #").SemiBold().FontSize(fontsize);
                                table.Cell().Element(CellStyle2).Text("Players").SemiBold().FontSize(fontsize);
                                table.Cell().Element(CellStyle2).Text("Score").SemiBold().FontSize(fontsize);
                                table.Cell().Element(CellStyle2).Text("Team #").SemiBold().FontSize(fontsize);
                                table.Cell().Element(CellStyle2).Text("Players").SemiBold().FontSize(fontsize);
                                table.Cell().Element(CellStyle2).Text("Score").SemiBold().FontSize(fontsize);
                                table.Cell().Element(CellStyle2).Text("Team Forfeiting").SemiBold().FontSize(fontsize);



                                static IContainer CellStyle(IContainer container)
                                {
                                    return container.Border(1).BorderColor(Colors.Black).PaddingVertical(5).AlignCenter();
                                }

                                if (matches.Where(x => x.Rink == -1).Count() > 0)
                                {
                                    var item = matches.Where(x => x.Rink == -1).First();
                                    table.Cell().Element(CellStyle).Text("Bye").FontSize(fontsize);
                                    table.Cell().Element(CellStyle).Text(item.Teamno1.ToString()).FontSize(fontsize);
                                    table.Cell().Element(CellStyle).Text(item.Player1).FontSize(fontsize);
                                    table.Cell().Element(CellStyle).Text("14").FontSize(fontsize);

                                    table.Cell().Element(CellStyle).Text("").FontSize(fontsize);
                                    table.Cell().Element(CellStyle).Text("").FontSize(fontsize);
                                    table.Cell().Element(CellStyle).Text("").FontSize(fontsize);
                                    table.Cell().Element(CellStyle).Text("").FontSize(fontsize);
                                }

                                foreach (MatchScoreView item in matches.Where(x => x.Rink > -1))
                                {

                                    table.Cell().Element(CellStyle).Text((item.Rink + 1).ToString()).FontSize(fontsize);
                                    table.Cell().Element(CellStyle).Text(item.Teamno1.ToString()).FontSize(fontsize);
                                    table.Cell().Element(CellStyle).Text(item.Player1).FontSize(fontsize);
                                    if (item.ForFeitId == item.Teamno2)
                                        table.Cell().Element(CellStyle).Text("14").FontSize(fontsize);
                                    else
                                        table.Cell().Element(CellStyle).Text(item.Team1Score.ToString()).FontSize(fontsize);
                                    table.Cell().Element(CellStyle).Text(item.Teamno2.ToString()).FontSize(fontsize);
                                    table.Cell().Element(CellStyle).Text(item.Player2).FontSize(fontsize);
                                    if (item.ForFeitId == item.Teamno1)
                                        table.Cell().Element(CellStyle).Text("14").FontSize(fontsize);
                                    else
                                        table.Cell().Element(CellStyle).Text(item.Team2Score.ToString()).FontSize(fontsize);
                                    table.Cell().Element(CellStyle).Text(item.ForFeitId.ToString()).FontSize(fontsize);
                                }
                            }); //table

                            column.Item().Text("    ");
                        }
                        column.Item().AlignCenter().Text("Standings").SemiBold();
                        column.Item().Text("    ");


                        for (int div = 1; div <= league?.Divisions; div++)
                        {
                            List<Standing> places = CalculateStandings.Doit(id, league.Id,div, db);
                            column.Item().AlignCenter().Table(table =>
                            {
                                if (league.Divisions > 1)
                                    table.Header(header =>
                                    {
                                        header.Cell().
                                            ColumnSpan(6)
                                            .AlignCenter()
                                            .AlignMiddle()
                                            .Text($"Division {div}");
                                    });

                            table.ColumnsDefinition(columns =>
                            {

                                columns.ConstantColumn(30); //place
                                columns.ConstantColumn(40); //team number
                                columns.ConstantColumn(150); //players
                                columns.ConstantColumn(30); //wins
                                columns.ConstantColumn(40); //loses
                                columns.ConstantColumn(60); //Total points

                            });

                                static IContainer CellStyle2(IContainer container)
                                {
                                    return container.Border(1).BorderColor(Colors.Black).PaddingVertical(1).AlignCenter();
                                }

                                table.Cell().Element(CellStyle2).Text("Place").SemiBold().FontSize(fontsize);
                                table.Cell().Element(CellStyle2).Text("Team #").SemiBold().FontSize(fontsize);
                                table.Cell().Element(CellStyle2).Text("Players").SemiBold().FontSize(fontsize);
                                table.Cell().Element(CellStyle2).Text("Wins").SemiBold().FontSize(fontsize);
                                table.Cell().Element(CellStyle2).Text("Loses").SemiBold().FontSize(fontsize);
                                table.Cell().Element(CellStyle2).Text("Total Points Scored").SemiBold().FontSize(fontsize);

                                static IContainer CellStyle(IContainer container)
                                {
                                    return container.Border(1).BorderColor(Colors.Black).PaddingVertical(5).AlignCenter();
                                }

                                foreach (Standing item in places)
                                {
                                    table.Cell().Element(CellStyle).Text(item.Place.ToString()).FontSize(fontsize);
                                    table.Cell().Element(CellStyle).Text(item.Team.ToString()).FontSize(fontsize);
                                    table.Cell().Element(CellStyle).Text(item.Players).FontSize(fontsize);
                                    table.Cell().Element(CellStyle).Text(item.Wins.ToString()).FontSize(fontsize);

                                    table.Cell().Element(CellStyle).Text(item.Loses.ToString()).FontSize(fontsize);
                                    table.Cell().Element(CellStyle).Text(item.TotalScore.ToString()).FontSize(fontsize);
                                }


                            }); // table

                            column.Item().Text("    ");
                            
                        }
                    });
                }); //page
            }); //container
        } //method
    } //class
} //namespace
            





