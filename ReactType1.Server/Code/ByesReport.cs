using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using ReactType1.Server.Models;
using System.Security.Policy;


namespace ReactType1.Server.Code
{


    public class ByesReport
    {



        /// <summary>
        /// 
        /// </summary>
        /// <param name="id">leagueid</param>
        /// <param name="db">context</param>
        public async Task<IDocument> CreateDocument(int id, DbLeagueApp db, string site)
        {
            League? league = await  db.Leagues
                .Include(l => l.Teams)
                .Where(x => x.Id == id).FirstOrDefaultAsync();
            string? LeagueName = league?.LeagueName;
            if (league?.Teams.Count % 2 == 0)
            {
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
                                column.Item().Text("No byes for this league");

                            });
                    });
                });
            }

            int? TeamSize = league?.TeamSize;
            List<GetByesView> teams = db.GetByesViews
                     .FromSql($"EXEC GetByes {id}")
                    .ToList();
           
           
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

                            });


                    page.Content().PaddingVertical(20).Column(column =>
                    {
                        column.Item().Inlined(inlined =>
                        {
                            inlined.Spacing(20);
                            inlined.Item().Text("");
                        });

                        column.Item().AlignCenter().Table(table =>
                        {
                            table.Header(header =>
                            {
                                header.Cell().ColumnSpan(3).AlignCenter().Text("Byes").FontSize(15);
                            });

                            // step 1
                            table.ColumnsDefinition(columns =>
                            {
                                columns.ConstantColumn(75); //date
                                columns.ConstantColumn(30); //rink
                                columns.ConstantColumn(180); //team1

                            });

                            static IContainer CellStyle2(IContainer container)
                            {
                                return container.Border(1).BorderColor(Colors.Black).PaddingVertical(5).AlignCenter();
                            }

                            // step 3
                            table.Cell().Element(CellStyle2).Text("Date").SemiBold().FontSize(10);
                            table.Cell().Element(CellStyle2).Text("Team").SemiBold().FontSize(10);
                            table.Cell().Element(CellStyle2).Text("Players").SemiBold().FontSize(10);

                            static IContainer CellStyle(IContainer container)
                            {
                                return container.Border(1).BorderColor(Colors.Black).PaddingVertical(5);
                            }

                            foreach (GetByesView item in teams)
                            {


                                table.Cell().Element(CellStyle).Text(item.GameDate.ToString()).FontSize(10).AlignRight(); 
                                table.Cell().Element(CellStyle).Text(item.TeamNo.ToString()).FontSize(10).AlignCenter(); 

                                table.Cell().Element(CellStyle).Text(item.Players).FontSize(10).AlignLeft(); 

                                

                            }

                        });
                    });
                });
            });
        }
    }
}

