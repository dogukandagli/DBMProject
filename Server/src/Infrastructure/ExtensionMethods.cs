using Domain.Abstractions;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Infrastructure;

public static class ExtensionMethods
{
    public static void ApplyGlobalFilters(this ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var clrType = entityType.ClrType;

            if (typeof(AuditableEntity).IsAssignableFrom(clrType))
            {
                var parameter = Expression.Parameter(clrType, "e");
                var property = Expression.Property(parameter, nameof(AuditableEntity.IsDeleted));
                var condition = Expression.Equal(property, Expression.Constant(false));
                var lambda = Expression.Lambda(condition, parameter);

                entityType.SetQueryFilter(lambda);
            }
        }
    }
}
