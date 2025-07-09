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


    public class PlayoffResults
    {


        /// <summary>
        /// 
        /// </summary>
        /// <param name="id">weekid</param>
        /// <param name="db">context</param>
        public async Task<IDocument> CreateDocument(int weekid, DbLeagueApp db, string site)
        {
            var schedule = await db.Schedules.FindAsync(weekid);
            var league = await db.Leagues.FindAsync(schedule?.Leagueid);
            int? TeamSize = league?.TeamSize;
            List<MatchScoreView> matches = db.MatchScoreViews
                     .FromSql($"EXEC MatchScore {weekid}")
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

                        
                            column.Item().AlignCenter().Table(table =>
                            {

                                table.Header(header =>
                                {

                                    header.Cell().
                                        ColumnSpan(6)
                                        .AlignCenter()
                                        .AlignMiddle()
                                        .Text($"Playoff games for week {schedule?.GameDate.ToShortDateString()}");
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

                            
                       
                       
                    });
                }); //page
            }); //container
        } //method
    } //class
} //namespace
            





