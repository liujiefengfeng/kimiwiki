
require 'erb'

class WikiContext
    def initialize(options)
        @wiki_title = options[:wiki_title] || "Just another wiki"
        @github_repo = options[:github_repo] || "kenpusney/wiki"
        @custom_domain = options[:custom_domain]

        @index_template = File.read("./.template/index.html.erb")
        @README_template = File.read("./.template/README.md.erb")
    end

    def render
        File.write("index.html", ERB.new(@index_template).result(binding))

        File.write("cnmd/README.cn.md",ERB.new(@README_template).result(binding))
        File.write("CNAME", @custom_domain) if @custom_domain
    end
end

def cleanup
    FileUtils.rm_rf("cnmd/.", secure: true)
    FileUtils.rm("CNAME", force: true)
    FileUtils.rm(Dir["*.json"], force: true)
end

def prompt(opts, key, hint)
    print(hint)
    val = STDIN.gets.chomp
    opts[key] = val.empty? ? nil : val
end

def initwiki
    cleanup
    opts = {}
    prompt(opts, :wiki_title, "Your wiki title:")
    prompt(opts, :github_repo, "Your repo [e.g. kenpusney/wiki]:")
    prompt(opts, :custom_domain, "Your custom domain [default: <username>.github.io/wiki]:")
    WikiContext.new(opts).render
end