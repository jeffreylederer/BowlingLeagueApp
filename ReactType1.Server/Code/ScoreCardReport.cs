using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using ReactType1.Server.Models;
using System.Data.Entity.Core.Common.CommandTrees.ExpressionBuilder;


namespace ReactType1.Server.Code
{


    public class ScorecardReport 
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
            List<GetMatchAllView> matches = db.GetMatchAllViews
                     .FromSql($"EXEC GetMatchAll {id}")
                    .ToList();
            string? LeagueName = league?.LeagueName;
            string? GameDate = schedule?.GameDate.ToShortDateString();
            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(25);

                    page.Header()
                            .AlignCenter()
                            .AlignMiddle()
                            .Column(column =>
                            {
                                column.Item().Text(site).FontSize(16); 
                                column.Item().Text(" ");
                                column.Item().Text(league?.LeagueName);
                                column.Item().Text(" ");
                            });
                            



                    page.Content()
                    
                    .Table(table =>
                    {

                        

                        // step 1
                        table.ColumnsDefinition(columns =>
                        {
                            columns.ConstantColumn(75); //date
                            columns.ConstantColumn(30); //rink
                            columns.ConstantColumn(40); //team1
                            columns.ConstantColumn(40); //team2
                            columns.ConstantColumn(60); //skip1
                            if (TeamSize.HasValue && TeamSize.Value == 3)
                            {
                                columns.ConstantColumn(60);
                            }
                            if (TeamSize.HasValue && TeamSize.Value > 1)
                            {
                                columns.ConstantColumn(60);
                            }
                            columns.ConstantColumn(60); //skip2
                            if (TeamSize.HasValue && TeamSize.Value == 3)
                            {
                                columns.ConstantColumn(60);
                            }
                            if (TeamSize.HasValue && TeamSize.Value > 1)
                            {
                                columns.ConstantColumn(60);
                            }
                        });




                        // step 3
                        table.Cell().Element(CellStyle2).Text("Date").SemiBold();
                        table.Cell().Element(CellStyle2).Text("Rink").SemiBold();
                        table.Cell().Element(CellStyle2).Text("Team1").SemiBold();
                        table.Cell().Element(CellStyle2).Text("Team2").SemiBold();
                        table.Cell().Element(CellStyle2).Text("Skip1").SemiBold();
                        if (TeamSize.HasValue && TeamSize.Value == 3)
                        {
                            table.Cell().Element(CellStyle2).Text("Vice1").SemiBold();
                        }
                        if (TeamSize.HasValue && TeamSize.Value > 1)
                        {
                            table.Cell().Element(CellStyle2).Text("Lead1").SemiBold();
                        }
                        table.Cell().Element(CellStyle2).Text("Skip2").SemiBold();
                        if (TeamSize.HasValue && TeamSize.Value == 3)
                        {
                            table.Cell().Element(CellStyle2).Text("Vice2").SemiBold();
                        }
                        if (TeamSize.HasValue && TeamSize.Value > 1)
                        {
                            table.Cell().Element(CellStyle2).Text("Lead2").SemiBold();
                        }

                        static IContainer CellStyle2(IContainer container)
                        {
                            return container.Border(1).BorderColor(Colors.Black).PaddingVertical(5).AlignCenter();
                        }

                        foreach (var item in matches)
                        {


                            table.Cell().Element(CellStyle).Text(GameDate);
                            table.Cell().Element(CellStyle).Text((item.Rink+1).ToString());
                            table.Cell().Element(CellStyle).Text(item.Team1.ToString());
                            table.Cell().Element(CellStyle).Text(item.Team2.ToString());
                            table.Cell().Element(CellStyle1).Text(item.Skip1);
                            if (TeamSize.HasValue && TeamSize.Value == 3)
                            {
                                table.Cell().Element(CellStyle1).Text(item.Vice1);
                            }
                            if (TeamSize.HasValue && TeamSize.Value > 1)
                            {
                                table.Cell().Element(CellStyle1).Text(item.Lead1);
                            }

                            table.Cell().Element(CellStyle1).Text(item.Skip2);
                            if (TeamSize.HasValue && TeamSize.Value == 3)
                            {
                                table.Cell().Element(CellStyle1).Text(item.Vice2);
                            }
                            if (TeamSize.HasValue && TeamSize.Value > 1)
                            {
                                table.Cell().Element(CellStyle1).Text(item.Lead2);
                            }

                            static IContainer CellStyle(IContainer container)
                            {
                                return container.Border(1).BorderColor(Colors.Black).PaddingVertical(5).AlignCenter();
                            }
                            static IContainer CellStyle1(IContainer container)
                            {
                                return container.Border(1).BorderColor(Colors.Black).PaddingVertical(5);
                            }
                        }
                    });
                });
            });
        }
    }
}
          
