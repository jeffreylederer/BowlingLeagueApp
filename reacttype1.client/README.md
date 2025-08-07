# React/Typescript Project
## Introduction

This a single page application (SPA) that looks like a Win Form application. The major difference is it uses states for URL parameters rather than command line ones.
## React client
I used the following react packages:
- @hookform/resolvers@3.9.1
- useQuery
- useTable
- flowbite-react@0.10.2
- react-hook-form@7.54.2
- react-router-dom@7.1.1
- zod@3.24.1

Each of these packages allowed me to write the client application.




### bootstrap
This allowed me to create pages that look correct independent of screen size.

### flowbite-react
This is a UI library forms with TextInput, Checkbox, Select and Button controls

### localstorage
I used localstorage aa a simple way to remember dynamic global values. This includes:
- the identity of the logged in user including the user's role.
- current league that the user is accessing.

###  hookform/resolvers and zod
Zod is a TypeScript-first schema declaration and validation used inside of forms. Hookform/resolvers handles is a hook to attached schemas to submit methods and input validations.

### react-router-dom
React Router is used as a simple, declarative routing library. Its only job is matching the URL to a set of components. It works with link controls to direct the application to the correct component.

### hooks
I used these hooks:
- useEffect - used like a page load in Win Form application for actions when the page loads.
- useState - used like a ViewState in Win Form application except changes to useState forces a refresh of the page
- useNavigate - like a Win Form Redirect method.
- useMutation and useQuery - This allowed me to call the web api server methods
- useTable - This displays tables (with pagenation) on functions that list records


## Web Api Server
This is a standard .Net Core project. It uses controller methods (which are called by the useQuery and  useMutation) to access database records and pass the results to the client. It uses Entity Framework as an 
object-relational mapper (ORM).

A clever thing I did was to call Stored Prcoedures on stored procedures with joins. First I created a stored procedure and then created a view that mimics the stored procedure results. Then running Scaffold-DbContex, I was able bring in the model of the view. Here is an example:

     List<TeamMember> list = await _context.TeamMemberViews
         .FromSql($"EXEC TeamMember{id}")
         .ToListAsync();

# New Features
I have added new features to both the the client and server projects. I have also added storybook stories for some components and pages.

## React
### Absolute or Alias paths 
This allowed import statements to use @component/Menu.tsx instead of ../../components/Menu.tsx
### Layouts
This creates a standard header and footer for each page. This compares to masterpage in .aspx
### Pagination
I have added pagination to the Membership and Players list pages
### Unit Testing
I have added vitest component library and created a simple unit test. It would be easy to create additional tests.
### Server/Proxy
This simplifies that url of useQuery and useMutation hooks


