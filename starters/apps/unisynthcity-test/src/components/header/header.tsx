import { component$, useStyles$ } from "@khulnasoft.com/unisynth";
import { Link, useLocation } from "@khulnasoft.com/unisynth-city";
import { useUserLoader } from "../../routes/layout";
import styles from "./header.css?inline";

export default component$(() => {
  const userData = useUserLoader();
  const loc = useLocation();

  useStyles$(styles);

  return (
    <header>
      <div class="header-inner">
        <section class="logo">
          <Link
            href="/unisynthcity-test/"
            prefetch={true}
            data-test-link="header-home"
          >
            Unisynth City 🏙
          </Link>
        </section>
        <nav data-test-header-links>
          <Link
            href="/unisynthcity-test/blog/"
            class={{
              active: loc.url.pathname.startsWith("/unisynthcity-test/blog/"),
            }}
            data-test-link="blog-home"
          >
            Blog
          </Link>
          <Link
            href="/unisynthcity-test/docs/"
            class={{
              active: loc.url.pathname.startsWith("/unisynthcity-test/docs/"),
            }}
            data-test-link="docs-home"
          >
            Docs
          </Link>
          <Link
            href="/unisynthcity-test/actions/"
            class={{
              active: loc.url.pathname.startsWith(
                "/unisynthcity-test/actions/",
              ),
            }}
            data-test-link="docs-actions"
          >
            Actions
          </Link>
          <Link
            href="/unisynthcity-test/api/"
            class={{
              active: loc.url.pathname.startsWith("/unisynthcity-test/api/"),
            }}
            data-test-link="api-home"
          >
            API
          </Link>
          <Link
            href="/unisynthcity-test/products/hat/"
            class={{
              active: loc.url.pathname.startsWith(
                "/unisynthcity-test/products/",
              ),
            }}
            data-test-link="products-hat"
          >
            Products
          </Link>
          <Link
            href="/unisynthcity-test/about-us/"
            class={{
              active: loc.url.pathname.startsWith(
                "/unisynthcity-test/about-us/",
              ),
            }}
            data-test-link="about-us"
          >
            About Us
          </Link>

          {userData.value.isAuthenticated ? (
            <Link href="/unisynthcity-test/sign-in/" data-test-link="sign-in">
              Dashboard
            </Link>
          ) : (
            <Link
              href="/unisynthcity-test/sign-in/"
              class={{
                active: loc.url.pathname.startsWith(
                  "/unisynthcity-test/sign-in/",
                ),
              }}
              data-test-link="sign-out"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
});
