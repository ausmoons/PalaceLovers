using Microsoft.AspNetCore.Identity;
using PalaceLovers.Models;

namespace PalaceLovers.Data
{
    public static class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider, ILogger logger)
        {
            using var scope = serviceProvider.CreateScope();
            var services = scope.ServiceProvider;

            var userManager = services.GetRequiredService<UserManager<User>>();
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

            string[] roleNames = { "Admin", "User" };
            IdentityResult roleResult;

            foreach (var roleName in roleNames)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    roleResult = await roleManager.CreateAsync(new IdentityRole(roleName));
                    if (roleResult.Succeeded)
                    {
                        logger.LogInformation($"Role {roleName} created.");
                    }
                    else
                    {
                        logger.LogError($"Failed to create role {roleName}:");
                        foreach (var error in roleResult.Errors)
                        {
                            logger.LogError(error.Description);
                        }
                    }
                }
                else
                {
                    logger.LogInformation($"Role {roleName} already exists.");
                }
            }

            logger.LogInformation($"Number of users in the database: {userManager.Users.Count()}");

            if (!userManager.Users.Any())
            {
                var adminUser = new User
                {
                    UserName = "admin@palacelovers.com",
                    Email = "admin@palacelovers.com",
                    CustomUsername = "Admin",
                    CreateDate = DateTime.UtcNow,
                    LastLoginDate = DateTime.UtcNow
                };

                string adminPassword = "Admin@123";
                var user = await userManager.FindByEmailAsync("admin@palacelovers.com");

                if (user == null)
                {
                    var createAdminUser = await userManager.CreateAsync(adminUser, adminPassword);
                    if (createAdminUser.Succeeded)
                    {
                        var addToRoleResult = await userManager.AddToRoleAsync(adminUser, "Admin");
                        if (addToRoleResult.Succeeded)
                        {
                            logger.LogInformation("Admin user created and assigned to Admin role.");
                        }
                        else
                        {
                            logger.LogError("Failed to assign admin user to Admin role:");
                            foreach (var error in addToRoleResult.Errors)
                            {
                                logger.LogError(error.Description);
                            }
                        }
                    }
                    else
                    {
                        logger.LogError("Failed to create admin user:");
                        foreach (var error in createAdminUser.Errors)
                        {
                            logger.LogError(error.Description);
                        }
                    }
                }
                else
                {
                    logger.LogInformation("Admin user already exists.");
                }
            }
            else
            {
                logger.LogInformation("Users already exist in the database.");
            }
        }
    }
}