# How to Host Images on GitHub for Your Portfolio

## Step 1: Create an Images Folder in Your GitHub Repo

1. Go to your GitHub repository: `https://github.com/azamoviich/myportfolio`
2. Click the **"Add file"** button → **"Create new file"**
3. Type `images/` as the folder name, then add a file name like `images/README.md`
4. Commit the file (this creates the images folder)
5. Or simply drag and drop images into the repository on GitHub

## Step 2: Upload Your Images

1. Navigate to the `images/` folder in your repo
2. Click **"Add file"** → **"Upload files"**
3. Upload your images:
   - `profile.jpg` (or .png) - Your profile photo
   - `project1.jpg` - Project 1 image
   - `project2.jpg` - Project 2 image
   - `project3.jpg` - Project 3 image
4. Commit the changes

## Step 3: Get the Raw GitHub URL

The format for raw GitHub image URLs is:
```
https://raw.githubusercontent.com/USERNAME/REPO-NAME/BRANCH-NAME/images/FILENAME
```

**Example for your repo:**
```
https://raw.githubusercontent.com/azamoviich/myportfolio/master/images/profile.jpg
```

**If your default branch is `main` instead of `master`:**
```
https://raw.githubusercontent.com/azamoviich/myportfolio/main/images/profile.jpg
```

## Step 4: Alternative - Using GitHub Pages (Recommended for better performance)

If you want faster loading, you can also use:
```
https://azamoviich.github.io/myportfolio/images/profile.jpg
```
*(This works after you deploy to GitHub Pages or Vercel)*

## Step 5: Replace in Your Code

Once you have your images uploaded, replace the stock photo URLs with your GitHub raw URLs in:
- `views/About.tsx` - Profile photo
- `constants.ts` - Project images
- `utils/translations.ts` - Project images (if different per language)

## Image Recommendations

- **Profile Photo**: 800x800px, square format, JPG or PNG
- **Project Images**: 1200x800px, landscape format, JPG (optimized for web)
- Keep file sizes under 500KB for faster loading

